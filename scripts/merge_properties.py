import os
import json
import random
import re

# Load parsed excel data relative to script location
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
excel_data_path = os.path.join(SCRIPT_DIR, 'excel_data.json')
with open(excel_data_path, 'r', encoding='utf-8') as f:
    excel_data = json.load(f)

# The first row is the header, skip it
rows = excel_data[1:]

unsplash_apartment_images = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
    "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80",
    "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80",
]

unsplash_house_images = [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80",
    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
]

agents = [
    {"name": "Армен Карапетян", "phone": "+374 91 123456", "avatar": "https://i.pravatar.cc/64?img=3", "verified": True},
    {"name": "Сона Мкртчян", "phone": "+374 77 234567", "avatar": "https://i.pravatar.cc/64?img=5", "verified": False},
    {"name": "Тигран Авакян", "phone": "+374 55 345678", "avatar": "https://i.pravatar.cc/64?img=12", "verified": True},
    {"name": "Алина Григорян", "phone": "+374 94 654321", "avatar": "https://i.pravatar.cc/64?img=34", "verified": True},
    {"name": "Арам Саркисян", "phone": "+374 93 987654", "avatar": "https://i.pravatar.cc/64?img=17", "verified": True},
    {"name": "Лусине Григорян", "phone": "+374 41 678901", "avatar": "https://i.pravatar.cc/64?img=20", "verified": False},
    {"name": "Вардан Аветисян", "phone": "+374 77 789012", "avatar": "https://i.pravatar.cc/64?img=25", "verified": True},
]

feature_pool = ["Паркинг", "Лифт", "Кондиционер", "Балкон", "Интернет", "Вид на горы", "Тихий двор", "Камин", "Консьерж", "Своя парковка", "Система Умный Дом"]

properties_js = []

for idx, r in enumerate(rows):
    # Parse ID
    num = r.get('A')
    if num is None:
        continue
    prop_id = f"excel_{num}"
    
    # City and Region
    city = r.get('B') or "Ереван"
    if city == "Ереван":
        region = "Ереван"
    elif city == "Гюмри":
        region = "Ширак"
    elif city == "Дилижан":
        region = "Тавуш"
    elif city == "Цахкадзор":
        region = "Котайк"
    elif city == "Ванадзор":
        region = "Лори"
    elif city == "Горис" or city == "Капан":
        region = "Сюник"
    else:
        region = "Ереван"
        
    # Property Type
    pt_raw = r.get('C') or "Квартира"
    if pt_raw == "Квартира":
        property_type = "apartment"
    elif pt_raw == "Дом":
        property_type = "house"
    elif pt_raw == "Коммерч.":
        property_type = "commercial"
    elif pt_raw == "Новостройка":
        property_type = "new_build"
    else:
        property_type = "apartment"
        
    # Listing Type
    lt_raw = r.get('D') or "Продажа"
    if lt_raw == "Продажа":
        listing_type = "sale"
    elif lt_raw == "Аренда":
        listing_type = "rent"
    elif lt_raw == "Посуточно":
        listing_type = "daily"
    else:
        listing_type = "sale"
        
    # Address and District
    address = r.get('E') or ""
    district = "Кентрон"
    if region == "Ереван":
        if "Арабкир" in address or "Адонц" in address:
            district = "Арабкир"
        elif "Кентрон" in address or "Арами" in address or "Абовян" in address or "Саят" in address or "Туманян" in address:
            district = "Кентрон"
        elif "Малатия" in address:
            district = "Малатия"
        elif "Эребуни" in address:
            district = "Эребуни"
        elif "Нор Норк" in address:
            district = "Нор Норк"
        elif "Шенгавит" in address:
            district = "Шенгавит"
        else:
            parts = address.split(',')
            if len(parts) > 0:
                district = parts[0].strip()
    else:
        district = city

    # Area (Sqm)
    sqm_raw = str(r.get('F') or "50")
    sqm_match = re.search(r'\d+', sqm_raw)
    sqm = int(sqm_match.group(0)) if sqm_match else 50
    
    # Price
    price_raw = str(r.get('G') or "100000")
    # remove $, commas, spaces
    price_clean = re.sub(r'[^\d]', '', price_raw)
    price = int(price_clean) if price_clean else 100000
    
    # Description
    desc = r.get('H') or f"{pt_raw} в г. {city}"
    full_desc = f"{desc}. Превосходный объект недвижимости в отличном районе с развитой инфраструктурой. Удобная транспортная развязка, магазины и школы в шаговой доступности."
    
    # Beds & Baths
    beds = 1
    if "3-комн" in desc or "3 комн" in desc or "3-комнатная" in desc or "3 комнаты" in desc:
        beds = 2
    elif "4-комн" in desc or "4 комн" in desc or "4-комнатная" in desc or "4 комнаты" in desc:
        beds = 3
    elif "2-комн" in desc or "2 комн" in desc or "2-комнатная" in desc or "2 комнаты" in desc or "двухкомнатная" in desc:
        beds = 1
    else:
        beds = max(1, int(sqm // 40))
        
    baths = 2 if beds >= 3 else 1
    
    # Floors
    if property_type == "house":
        floor = 1
        total_floors = 2
    else:
        floor = random.randint(1, 9)
        total_floors = random.choice([9, 12, 16])
        
    # Lat/Lng (realistic for Armenia)
    random.seed(idx)
    offset_lat = random.uniform(-0.015, 0.015)
    offset_lng = random.uniform(-0.015, 0.015)
    if region == "Ереван":
        if district == "Арабкир":
            lat, lng = 40.2085 + offset_lat, 44.5028 + offset_lng
        elif district == "Малатия":
            lat, lng = 40.1770 + offset_lat, 44.4600 + offset_lng
        elif district == "Эребуни":
            lat, lng = 40.1500 + offset_lat, 44.5200 + offset_lng
        elif district == "Нор Норк":
            lat, lng = 40.1980 + offset_lat, 44.5600 + offset_lng
        elif district == "Шенгавит":
            lat, lng = 40.1450 + offset_lat, 44.4850 + offset_lng
        else: # Kentron
            lat, lng = 40.1792 + offset_lat, 44.5152 + offset_lng
    elif city == "Гюмри":
        lat, lng = 40.7829 + offset_lat, 43.8358 + offset_lng
    elif city == "Дилижан":
        lat, lng = 40.7418 + offset_lat, 44.8608 + offset_lng
    elif city == "Цахкадзор":
        lat, lng = 40.5333 + offset_lat, 44.7167 + offset_lng
    elif city == "Ванадзор":
        lat, lng = 40.8074 + offset_lat, 44.4970 + offset_lng
    elif city == "Капан":
        lat, lng = 39.2076 + offset_lat, 46.4055 + offset_lng
    elif city == "Горис":
        lat, lng = 39.5126 + offset_lat, 46.3378 + offset_lng
    else:
        lat, lng = 40.1792 + offset_lat, 44.5152 + offset_lng
        
    # Images
    if property_type == "house":
        img_pool = unsplash_house_images
    else:
        img_pool = unsplash_apartment_images
    
    # Shuffle or select uniquely
    selected_imgs = random.sample(img_pool, k=min(3, len(img_pool)))
    
    # AI Tag
    ai_tag = "market_price"
    if idx % 4 == 0:
        ai_tag = "good_deal"
    elif idx % 4 == 1:
        ai_tag = "overpriced"
        
    price_per_sqm = int(price // sqm)
    
    # Features
    selected_features = random.sample(feature_pool, k=random.randint(3, 5))
    
    # Agent
    agent = random.choice(agents)
    
    # Building / Renovation characteristics
    b_type = "Каменный" if property_type == "house" else random.choice(["Монолит", "Каменный", "Панельный"])
    r_type = random.choice(["Евроремонт", "Дизайнерский", "Косметический"]) if beds > 1 else "Косметический"
    
    prop_obj = {
        "id": prop_id,
        "title": f"{pt_raw} {sqm} м² ({address})",
        "address": address,
        "district": district,
        "region": region,
        "city": city,
        "price": price,
        "currency": "$",
        "listingType": listing_type,
        "propertyType": property_type,
        "beds": beds,
        "baths": baths,
        "sqm": sqm,
        "floor": floor,
        "totalFloors": total_floors,
        "renovated": True,
        "newBuild": property_type == "new_build" or idx % 5 == 0,
        "mortgageEligible": idx % 3 != 0,
        "ownerListing": idx % 3 == 0,
        "lat": round(lat, 5),
        "lng": round(lng, 5),
        "images": selected_imgs,
        "aiTag": ai_tag,
        "pricePerSqm": price_per_sqm,
        "description": full_desc,
        "publishedDate": f"2026-05-{10 + (idx % 10)}",
        "agent": agent,
        "features": selected_features,
        "rooms": beds + 1,
        "buildingType": b_type,
        "renovationType": r_type,
        "parking": True if "Паркинг" in selected_features or "Своя парковка" in selected_features else False,
        "metro": "5-10 мин. пешком" if region == "Ереван" and district == "Кентрон" else "Нет",
        "balcony": True if "Балкон" in selected_features else False,
        "yearBuilt": random.randint(1980, 2023),
        "rentalYield": round(random.uniform(5.5, 11.5), 1),
        "potentialAppreciation": round(random.uniform(4.5, 16.5), 1),
        "liquidity": random.choice(["high", "medium", "low"]),
        "demandScore": random.randint(65, 98)
    }
    
    properties_js.append(prop_obj)

# Read properties.ts original file content relative to script location
properties_ts_path = os.path.join(SCRIPT_DIR, '../arm_home_app/src/data/properties.ts')
with open(properties_ts_path, 'r', encoding='utf-8') as file:
    content = file.read()

# Generate the JSON-like representation of properties for JS
prop_json = json.dumps(properties_js, indent=2, ensure_ascii=False)

# Let's replace MOCK_PROPERTIES definition
# Find MOCK_PROPERTIES block and append our items to it
mock_props_match = re.search(r'export const MOCK_PROPERTIES:\s*Property\[\]\s*=\s*\[([\s\S]*?)\];', content)
if mock_props_match:
    original_mock_block = mock_props_match.group(1)
    # We will parsed the original MOCK_PROPERTIES structure or just concatenate our array contents
    # Since our items are structured nicely as JS objects, let's prepare the js string
    props_str_list = []
    for p in properties_js:
        # Format keys nicely (e.g. key: value)
        p_str = json.dumps(p, indent=4, ensure_ascii=False)
        # remove quotes from keys in JS style
        p_str_js = re.sub(r'"(\w+)":', r'\1:', p_str)
        props_str_list.append(p_str_js)
        
    new_items_block = ",\n".join(props_str_list)
    new_mock_block = f"export const MOCK_PROPERTIES: Property[] = [\n{original_mock_block.strip()},\n{new_items_block}\n];"
    
    updated_content = content.replace(mock_props_match.group(0), new_mock_block)
    
    with open(properties_ts_path, 'w', encoding='utf-8') as file:
        file.write(updated_content)
    print("MOCK_PROPERTIES successfully updated with 80 new excel properties!")
else:
    print("MOCK_PROPERTIES pattern not found!")
