import zipfile
import xml.etree.ElementTree as ET
import json
import re

def parse_xlsx(file_path):
    ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
    
    with zipfile.ZipFile(file_path, 'r') as z:
        shared_strings = []
        try:
            with z.open('xl/sharedStrings.xml') as f:
                tree = ET.parse(f)
                root = tree.getroot()
                for t in root.findall('.//ns:t', ns):
                    shared_strings.append(t.text)
        except KeyError:
            pass
            
        with z.open('xl/worksheets/sheet1.xml') as f:
            tree = ET.parse(f)
            root = tree.getroot()
            
        rows = {}
        for row in root.findall('.//ns:row', ns):
            row_idx = int(row.get('r'))
            row_cells = []
            for cell in row.findall('ns:c', ns):
                cell_ref = cell.get('r')
                cell_type = cell.get('t')
                val_elem = cell.find('ns:v', ns)
                val = val_elem.text if val_elem is not None else None
                
                if cell_type == 'inlineStr':
                    is_elem = cell.find('ns:is', ns)
                    if is_elem is not None:
                        t_elem = is_elem.find('ns:t', ns)
                        if t_elem is not None:
                            val = t_elem.text
                elif val is not None:
                    if cell_type == 's':
                        val = shared_strings[int(val)]
                    elif cell_type == 'b':
                        val = (val == '1')
                    else:
                        try:
                            val = float(val) if '.' in val else int(val)
                        except ValueError:
                            pass
                row_cells.append((cell_ref, val))
            rows[row_idx] = row_cells
            
    col_re = re.compile(r'([A-Z]+)([0-9]+)')
    
    formatted_rows = []
    for r_idx in sorted(rows.keys()):
        cells = rows[r_idx]
        row_dict = {}
        for ref, val in cells:
            m = col_re.match(ref)
            if m:
                col_letter = m.group(1)
                row_dict[col_letter] = val
        formatted_rows.append(row_dict)
        
    return formatted_rows

if __name__ == '__main__':
    data = parse_xlsx('real_armenia_estate_80.xlsx')
    headers = data[0]
    print("Headers:")
    print(json.dumps(headers, indent=2, ensure_ascii=False))
    
    print("\nFirst row of data (index 1):")
    if len(data) > 1:
        print(json.dumps(data[1], indent=2, ensure_ascii=False))
        
    print("\nTotal rows found:", len(data))
    
    with open('excel_data.json', 'w', encoding='utf-8') as out:
        json.dump(data, out, indent=2, ensure_ascii=False)
