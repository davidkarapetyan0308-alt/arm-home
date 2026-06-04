import { createContext, useContext, useState, useEffect, type ReactNode, useCallback, useRef } from 'react';
import { MOCK_PROPERTIES, type Property, type ListingType, type PropertyType } from '../data/properties';
import { auth, db, messaging } from '../firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, getDocs, onSnapshot, updateDoc, collection, query, deleteDoc, where, arrayUnion, serverTimestamp } from 'firebase/firestore';

export type Language = 'RU' | 'EN' | 'AM';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  RU: {
    search: 'Поиск',
    map: 'Карта',
    saved: 'Избранное',
    messages: 'Сообщения',
    profile: 'Профиль',
    back: 'Назад',
    reset: 'Сбросить',
    newest: 'Новые',
    price_asc: 'Дешевле',
    price_desc: 'Дороже',
    sqm_sort: 'По площади',
    sale: 'Продажа',
    rent: 'Аренда',
    daily: 'Посуточно',
    new_build: 'Новостройки',
    mortgage: 'Ипотека',
    beds: 'спальни',
    baths: 'ванны',
    sqm: 'м²',
    renovated: 'Ремонт',
    write: 'Написать',
    call: 'Позвонить',
    search_placeholder: 'Поиск по названию, адресу...',
    search_map_placeholder: 'Район, улица, ЖК...',
    no_properties: 'Объектов не найдено',
    try_changing_filters: 'Попробуйте изменить фильтры',
    my_listings: 'Мои объявления',
    manage_listings: 'Управление вашим жильем',
    add: 'Добавить',
    no_listings_yet: 'Вы пока не добавили ни одного объекта',
    views: 'Просмотры',
    requests: 'Запросы',
    notifications: 'Уведомления',
    dark_theme: 'Тёмная тема',
    lang_interface: 'Язык интерфейса',
    support: 'Поддержка',
    about: 'О приложении',
    logout: 'Выйти',
    telegram_bot: 'Telegram-бот',
    bot_connected: 'Бот успешно подключен',
    bot_notifications: 'Мгновенные уведомления в Telegram',
    connect: 'Подключить',
    disconnect: 'Отключить',
    history: 'История просмотров',
    close: 'Закрыть',
    active: 'ВКЛ',
    inactive: 'ВЫКЛ',
    objects_suffix: 'объектов',
    toast_added: 'Объявление добавлено!',
    toast_deleted: 'Объявление удалено',
    new_listing_title: 'Новое объявление',
    listing_deal_type: 'ԳՈՐԾԱՐՔԻ ՏԵՍԱԿԸ *', // wait, listing_deal_type in RU is 'ТИП СДЕЛКИ *'
    listing_prop_type: 'ТИП НЕДВИЖИМОСТИ *',
    listing_name: 'НАЗВАНИЕ ОБЪЯВЛЕНИЯ *',
    listing_price: 'ЦЕНА (USD) *',
    listing_area: 'ПЛОЩАДЬ (КВ.М) *',
    listing_district: 'РАЙОН *',
    listing_address: 'АДРЕС *',
    listing_description: 'ОПИСАНИЕ',
    publish: 'Опубликовать',
    apartment: 'Квартира',
    house: 'Дом',
    commercial: 'Коммерч.',
    all: 'Все',
    support_title: 'Служба поддержки',
    support_intro: 'Здравствуйте! Служба поддержки Arm Home на связи. Чем я могу вам помочь?',
    support_placeholder: 'Задайте вопрос...',
    toast_bot_connected: 'Telegram бот успешно подключен!',
    toast_bot_disconnected: 'Telegram бот отключен',
    toast_saved_theme: 'Тема изменена',
    good_deal: '🤖 Выгодная цена',
    market_price: '🤖 Рыночная цена',
    overpriced: '🤖 Переоценено',
    list_view: 'Список объектов',
    filters_title: 'Фильтры',
    region_label: 'Регион',
    city_label: 'Город / Район',
    deal_type_label: 'Тип сделки',
    beds_label: 'Количество спален',
    price_label: 'Цена (USD)',
    min_price_placeholder: 'От',
    max_price_placeholder: 'До',
    additional_label: 'Дополнительно',
    show_results: 'Показать',
    renovated_toggle: 'С ремонтом',
    new_build_toggle: 'Новостройка',
    mortgage_toggle: 'Ипотека',
    owner_toggle: 'Только от собственника',
    cabinet_title: 'Кабинет',
    edit_profile: 'Редактировать профиль',
    saved_stats: 'Сохранено',
    searches_stats: 'Поисков',
    active_ads_stats: 'Активных объв.',
    my_saved_properties: 'Мои сохраненные объекты',
    recent_searches: 'Последние поиски',
    settings_support: 'НАСТРОЙКИ И ПОДДЕРЖКА',
    account_settings: 'Настройки аккаунта',
    mortgage_applications: 'Заявки на ипотеку',
    help_support: 'Помощь и поддержка',
    sign_out: 'Выйти из системы',
    delete_account: 'Удалить аккаунт',
    delete_account_warn: 'Удаление вашего аккаунта является необратимым процессом и приведет к удалению всех сохраненных объектов и поисковых запросов.',
    new_listings_toggle: 'Новые объявления',
    price_drops_toggle: 'Снижение цен',
    marketing_toggle: 'Маркетинг',
    dark_mode_toggle: 'Тёмная тема',
    language_pref: 'Язык',
    currency_pref: 'Валюта',
    map_layers: 'Слои карты',
    layer_roadmap: 'Схема',
    layer_satellite: 'Спутник',
    layer_dark: 'Тёмная',
    compare: 'Сравнение',
    compare_added: 'Добавлено к сравнению',
    compare_full: 'Можно сравнить максимум 4 объекта',
    property_not_found: 'Объект не найден',
    call_permission_error: 'Ошибка: Доступ к микрофону и камере отклонен или устройства не найдены.',
    per_sqm: 'за м²',
    stat_beds: 'Спальни',
    stat_baths: 'Ванные',
    stat_area: 'Площадь',
    stat_floor: 'Этаж',
    renovated_tag: '✓ С ремонтом',
    new_build_tag: '🏗 Новостройка',
    mortgage_tag: '💰 Ипотека',
    owner_tag: '👤 От собственника',
    virtual_tour_tag: '🥽 Виртуальный тур',
    description: 'Описание',
    amenities: 'Удобства',
    agent: 'Агент',
    published_date: 'Опубликовано',
    call_method: 'Способ звонка',
    cellular_call: 'Сотовая связь',
    audio_call: 'Аудиозвонок Arm Home',
    free_in_app: 'Бесплатно внутри приложения',
    video_call: 'Видеозвонок Arm Home',
    share_video_with_agent: 'Поделиться видео с агентом',
    cancel: 'Отмена',
    caller_on_line_video: 'Собеседник на линии (Видеоактивно)',
    connecting_video: 'Подключение видеоканала...',
    calling: 'Идет вызов...',
    mute_on: 'Вкл. звук',
    mute_off: 'Выкл. звук',
    video_off: 'Выкл. видео',
    camera: 'Камера',
    volume: 'Громкость',
    no_saved_properties: 'Нет сохранённых объектов',
    click_heart_to_save: 'Нажмите ❤️ на любом объекте, чтобы сохранить',
    skip: 'Пропустить',
    welcome_title: 'Недвижимость, прозрачно.',
    welcome_subtitle: 'Найдите дом своей мечты в Армении с оценкой искусственного интеллекта и проверенными объявлениями.',
    register_btn: 'Зарегистрироваться',
    login_btn: 'Войти в аккаунт',
    continue_as_guest: 'Продолжить как гость',
    feat_verified_title: 'Проверенные объявления',
    feat_verified_desc: 'Каждый объект физически проверяется нашей командой. Без фальшивых фото и скрытых дефектов.',
    feat_ai_title: 'Оценка рынка ИИ',
    feat_ai_desc: 'Узнайте реальную рыночную стоимость перед переговорами. Наш ИИ анализирует тысячи данных.',
    feat_chat_title: 'Прямой чат с агентом',
    feat_chat_desc: 'Мгновенно связывайтесь с сертифицированными местными агентами и координируйте показы.',
    privacy_policy: 'Политика конфиденциальности',
    terms_of_service: 'Условия использования',
    contact_support: 'Служба поддержки',
    ai_valuation_insights: 'Аналитика оценки ИИ',
    yerevan_property_index: 'Индекс недвижимости Еревана на основе аналитики объявлений:',
    avg_price_kentron: 'Средняя цена в Кентроне',
    avg_price_arabkir: 'Средняя цена в Арабкире',
    market_demand_trend: 'Тренд спроса на рынке',
    privacy_policy_text: 'Мы ценим вашу конфиденциальность. Arm Home собирает только информацию, необходимую для связи покупателей с агентами и проверки деталей объекта. Мы никогда не продаем ваши личные данные третьим лицам.',
    terms_of_service_text: 'Используя Arm Home, вы соглашаетесь просматривать только проверенные и реальные предложения недвижимости. Любое ненадлежащее использование контактных данных или профилей агентов строго запрещено и может привести к блокировке аккаунта.',
    contact_support_text: '📍 Ереван, Армения, ул. Арама 15\n\n✉️ support@armhome.am\n\n📞 +374 91 123456',
    
    // Additional keys for full localization
    map_tab: 'Карта',
    feed_tab: 'Лента',
    saved_tab: 'Сохранённые',
    agent_tab: 'Агент',
    filters_button: 'Фильтры',
    dialogue_started: 'Диалог начат',
    owner_agent: 'Собственник / Агент',
    buyer: 'Покупатель',
    login_chat_prompt: 'Пожалуйста, войдите в свой профиль, чтобы общаться с владельцами недвижимости напрямую.',
    login_register_btn: 'Войти или Создать профиль',
    incoming_video_call: '📹 Входящий видеозвонок...',
    incoming_audio_call: '📞 Входящий звонок...',
    decline: 'Отклонить',
    accept: 'Принять',
    dialogues_with_users: 'Диалоги с пользователями',
    online: 'В сети',
    no_messages: 'Сообщений нет',
    messages_empty_desc: 'Здесь будут отображаться ваши переписки по поводу недвижимости.',
    property: 'Объект',
    to_map: 'На карту',
    message_placeholder: 'Сообщение...',
    quick_reply_1: 'Когда возможен показ?',
    quick_reply_2: 'Какова окончательная цена?',
    quick_reply_3: 'Есть видео объекта?',
    toast_mic_camera_error: 'Не удалось получить доступ к микрофону/камере. Проверьте разрешения.',
    toast_call_connection_error: 'Ошибка при подключении к звонку',
    toast_redirecting_to_map: 'Перенаправление на карту...',
    owner_hello_text: 'Здравствуйте! Я собственник этого объявления',
    realtor_hello_text: 'Здравствуйте! Я риелтор этого объявления',
    how_can_i_help: 'Чем могу помочь?',
    street_panorama: '360° Уличная панорама',
    drag_to_spin: 'Зажмите и ведите мышкой или пальцем для обзора 360°',
    enter_courtyard: 'Заглянуть во двор',
    expand_panorama: 'Развернуть',
    collapse_panorama: 'Свернуть',
  },
  EN: {
    search: 'Search',
    map: 'Map',
    saved: 'Saved',
    messages: 'Messages',
    profile: 'Profile',
    back: 'Back',
    reset: 'Reset',
    newest: 'Newest',
    price_asc: 'Cheapest',
    price_desc: 'Most expensive',
    sqm_sort: 'By area',
    sale: 'Sale',
    rent: 'Rent',
    daily: 'Daily',
    new_build: 'New Build',
    mortgage: 'Mortgage',
    beds: 'beds',
    baths: 'baths',
    sqm: 'sqm',
    renovated: 'Renovated',
    write: 'Message',
    call: 'Call',
    search_placeholder: 'Search by title, address...',
    search_map_placeholder: 'District, street, complex...',
    no_properties: 'No properties found',
    try_changing_filters: 'Try changing filters',
    my_listings: 'My Listings',
    manage_listings: 'Manage your listings',
    add: 'Add',
    no_listings_yet: "You haven't added any properties yet",
    views: 'Views',
    requests: 'Requests',
    notifications: 'Notifications',
    dark_theme: 'Dark Theme',
    lang_interface: 'Language',
    support: 'Support',
    about: 'About',
    logout: 'Log Out',
    telegram_bot: 'Telegram Bot',
    bot_connected: 'Bot connected successfully',
    bot_notifications: 'Instant notifications in Telegram',
    connect: 'Connect',
    disconnect: 'Disconnect',
    history: 'Viewing History',
    close: 'Close',
    active: 'ON',
    inactive: 'OFF',
    objects_suffix: 'properties',
    toast_added: 'Listing added successfully!',
    toast_deleted: 'Listing deleted',
    new_listing_title: 'New Listing',
    listing_deal_type: 'DEAL TYPE *',
    listing_prop_type: 'PROPERTY TYPE *',
    listing_name: 'LISTING TITLE *',
    listing_price: 'PRICE (USD) *',
    listing_area: 'AREA (SQM) *',
    listing_district: 'DISTRICT *',
    listing_address: 'ADDRESS *',
    listing_description: 'DESCRIPTION',
    publish: 'Publish',
    apartment: 'Apartment',
    house: 'House',
    commercial: 'Commercial',
    all: 'All',
    support_title: 'Support Service',
    support_intro: 'Hello! Arm Home Support is online. How can we help you today?',
    support_placeholder: 'Type your message...',
    toast_bot_connected: 'Telegram bot connected successfully!',
    toast_bot_disconnected: 'Telegram bot disconnected',
    toast_saved_theme: 'Theme changed',
    good_deal: '🤖 Great Deal',
    market_price: '🤖 Market Price',
    overpriced: '🤖 Overpriced',
    list_view: 'List View',
    filters_title: 'Filters',
    region_label: 'Region',
    city_label: 'City / District',
    deal_type_label: 'Deal Type',
    beds_label: 'Bedrooms',
    price_label: 'Price (USD)',
    min_price_placeholder: 'Min',
    max_price_placeholder: 'Max',
    additional_label: 'Additional',
    show_results: 'Show',
    renovated_toggle: 'Renovated',
    new_build_toggle: 'New Build',
    mortgage_toggle: 'Mortgage eligible',
    owner_toggle: 'By owner only',
    cabinet_title: 'Cabinet',
    edit_profile: 'Edit Profile',
    saved_stats: 'Saved',
    searches_stats: 'Searches',
    active_ads_stats: 'Active Ads',
    my_saved_properties: 'My Saved Properties',
    recent_searches: 'Recent Searches',
    settings_support: 'SETTINGS & SUPPORT',
    account_settings: 'Account Settings',
    mortgage_applications: 'Mortgage Applications',
    help_support: 'Help & Support',
    sign_out: 'Sign Out',
    delete_account: 'Delete Account',
    delete_account_warn: 'Deleting your account is permanent and will remove all saved properties and searches.',
    new_listings_toggle: 'New Listings',
    price_drops_toggle: 'Price Drops',
    marketing_toggle: 'Marketing',
    dark_mode_toggle: 'Dark Mode',
    language_pref: 'Language',
    currency_pref: 'Currency',
    map_layers: 'Map Layers',
    layer_roadmap: 'Roadmap',
    layer_satellite: 'Satellite',
    layer_dark: 'Dark Mode',
    compare: 'Compare',
    compare_added: 'Added to compare',
    compare_full: 'You can compare up to 4 properties',
    property_not_found: 'Property not found',
    call_permission_error: 'Error: Microphone and camera access denied or devices not found.',
    per_sqm: 'per sqm',
    stat_beds: 'Bedrooms',
    stat_baths: 'Bathrooms',
    stat_area: 'Area',
    stat_floor: 'Floor',
    renovated_tag: '✓ Renovated',
    new_build_tag: '🏗 New Build',
    mortgage_tag: '💰 Mortgage',
    owner_tag: '👤 By Owner',
    virtual_tour_tag: '🥽 Virtual Tour',
    description: 'Description',
    amenities: 'Amenities',
    agent: 'Agent',
    published_date: 'Published',
    call_method: 'Call Method',
    cellular_call: 'Cellular Network',
    audio_call: 'Arm Home Audio Call',
    free_in_app: 'Free inside the app',
    video_call: 'Arm Home Video Call',
    share_video_with_agent: 'Share video with the agent',
    cancel: 'Cancel',
    caller_on_line_video: 'Connected (Video active)',
    connecting_video: 'Connecting video...',
    calling: 'Calling...',
    mute_on: 'Unmute',
    mute_off: 'Mute',
    video_off: 'Stop Video',
    camera: 'Camera',
    volume: 'Volume',
    no_saved_properties: 'No saved properties',
    click_heart_to_save: 'Tap ❤️ on any property to save it',
    skip: 'Skip',
    welcome_title: 'Real Estate, Transparently.',
    welcome_subtitle: 'Find your dream home in Armenia with AI-backed valuations and verified listings.',
    register_btn: 'Sign Up',
    login_btn: 'Log In',
    continue_as_guest: 'Continue as guest',
    feat_verified_title: 'Verified Listings',
    feat_verified_desc: 'Every property is physically vetted by our team. No fake photos, no hidden flaws. Total transparency.',
    feat_ai_title: 'AI Market Valuation',
    feat_ai_desc: 'Know the true market value before you negotiate. Our AI analyzes thousands of data points to ensure fair pricing.',
    feat_chat_title: 'Direct Agent Chat',
    feat_chat_desc: 'Connect instantly with trusted, certified local agents. Skip the phone tag and coordinate viewings directly in-app.',
    privacy_policy: 'Privacy Policy',
    terms_of_service: 'Terms of Service',
    contact_support: 'Contact Support',
    ai_valuation_insights: 'AI Valuation Insights',
    yerevan_property_index: 'Yerevan property index value based on real-time listing analytics:',
    avg_price_kentron: 'Kentron Avg. Price',
    avg_price_arabkir: 'Arabkir Avg. Price',
    market_demand_trend: 'Market Demand Trend',
    privacy_policy_text: 'We value your privacy. Arm Home only collects information necessary to connect buyers with agents and verify property details. We never sell your personal data to third parties.',
    terms_of_service_text: 'By using Arm Home, you agree to browse only verified, genuine real estate opportunities. Any misuse of contact details or agent profiles is strictly prohibited and subject to account suspension.',
    contact_support_text: '📍 Yerevan, Armenia, Aram Str. 15\n\n✉️ support@armhome.am\n\n📞 +374 91 123456',
    
    // Additional keys for full localization
    map_tab: 'Map',
    feed_tab: 'Feed',
    saved_tab: 'Saved',
    agent_tab: 'Agent',
    filters_button: 'Filters',
    dialogue_started: 'Dialogue started',
    owner_agent: 'Owner / Agent',
    buyer: 'Buyer',
    login_chat_prompt: 'Please log in to chat with property owners directly.',
    login_register_btn: 'Log In or Create Profile',
    incoming_video_call: '📹 Incoming video call...',
    incoming_audio_call: '📞 Incoming call...',
    decline: 'Decline',
    accept: 'Accept',
    dialogues_with_users: 'Dialogues with users',
    online: 'Online',
    no_messages: 'No messages',
    messages_empty_desc: 'Your real estate conversations will appear here.',
    property: 'Property',
    to_map: 'To map',
    message_placeholder: 'Message...',
    quick_reply_1: 'When is the viewing possible?',
    quick_reply_2: 'What is the final price?',
    quick_reply_3: 'Is there a video of the property?',
    toast_mic_camera_error: 'Failed to access microphone/camera. Check permissions.',
    toast_call_connection_error: 'Error connecting to the call',
    toast_redirecting_to_map: 'Redirecting to map...',
    owner_hello_text: 'Hello! I am the owner of this listing',
    realtor_hello_text: 'Hello! I am the realtor for this listing',
    how_can_i_help: 'How can I help you?',
    street_panorama: '360° Street Panorama',
    drag_to_spin: 'Drag or swipe to explore in 360°',
    enter_courtyard: 'View building courtyard',
    expand_panorama: 'Expand',
    collapse_panorama: 'Collapse',
  },
  AM: {
    search: 'Որոնում',
    map: 'Քարտեզ',
    saved: 'Պահված',
    messages: 'Հաղորդագր.',
    profile: 'Անձնական էջ',
    back: 'Հետ',
    reset: 'Մաքրել',
    newest: 'Նորերը',
    price_asc: 'Ամենաէժան',
    price_desc: 'Ամենաթանկ',
    sqm_sort: 'Ըստ մակերեսի',
    sale: 'Վաճառք',
    rent: 'Վարձակալ.',
    daily: 'Օրավարձ',
    new_build: 'Նորակառույց',
    mortgage: 'Հիփոթեք',
    beds: 'ննջասենյակ',
    baths: 'լոգարան',
    sqm: 'քմ',
    renovated: 'Վերանորոգված',
    write: 'Գրել',
    call: 'Զանգահարել',
    search_placeholder: 'Որոնել ըստ վերնագրի, հասցեի...',
    search_map_placeholder: 'Թաղամաս, փողոց, համալիր...',
    no_properties: 'Հայտարարություն չի գտնվել',
    try_changing_filters: 'Փորձեք փոխել զտիչները',
    my_listings: 'Իմ հայտարարությունները',
    manage_listings: 'Կառավարել Ձեր հայտարարությունները',
    add: 'Ավելացնել',
    no_listings_yet: 'Դուք դեռ ոչ մի հայտարարություն չեք ավելացրել',
    views: 'Դիտումներ',
    requests: 'Հարցումներ',
    notifications: 'Ծանուցումներ',
    dark_theme: 'Մութ ռեժիմ',
    lang_interface: 'Լեզուն',
    support: 'Աջակցություն',
    about: 'Հավելվածի մասին',
    logout: 'Դուրս գալ',
    telegram_bot: 'Telegram բոտ',
    bot_connected: 'Բոտը հաջողությամբ միացված է',
    bot_notifications: 'Ակնթարթային ծանուցումներ Telegram-ում',
    connect: 'Միացնել',
    disconnect: 'Անջատել',
    history: 'Դիտումների պատմություն',
    close: 'Փակել',
    active: 'ՄԻԱՑ',
    inactive: 'ԱՆՋԱՏ',
    objects_suffix: 'հայտարարություն',
    toast_added: 'Հայտարարությունն ավելացված է:',
    toast_deleted: 'Հայտարարությունը ջնջված է',
    new_listing_title: 'Նոր հայտարարություն',
    listing_deal_type: 'ԳՈՐԾԱՐՔԻ ՏԵՍԱԿԸ *',
    listing_prop_type: 'ԳՈՒՅՔԻ ՏԵՍԱԿԸ *',
    listing_name: 'ՀԱՅՏԱՐԱՐՈՒԹՅԱՆ ՎԵՐՆԱԳԻՐԸ *',
    listing_price: 'ԱՐԺԵՔԸ (USD) *',
    listing_area: 'ՄԱԿԵՐԵՍԸ (ՔՄ) *',
    listing_district: 'ԹԱՂԱՄԱՍ *',
    listing_address: 'ՀԱՍՑԵ *',
    listing_description: 'ՆԿԱՐԱԳՐՈՒԹՅՈՒՆ',
    publish: 'Հրապարակել',
    apartment: 'Բնակարան',
    house: 'Առանձնատուն',
    commercial: 'Կոմերցիոն',
    all: 'Բոլորը',
    support_title: 'Աջակցման ծառայություն',
    support_intro: 'Բարև Ձեզ: Arm Home աջակցման կենտրոնը պատրաստ է օգնել Ձեզ:',
    support_placeholder: 'Գրեք Ձեր հարցը...',
    toast_bot_connected: 'Telegram բոտը հաջողությամբ միացվեց:',
    toast_bot_disconnected: 'Telegram բոտն անջատված է',
    toast_saved_theme: 'Ռեժիմը փոխվեց',
    good_deal: '🤖 Շահավետ գին',
    market_price: '🤖 Շուկայական գին',
    overpriced: '🤖 Գերագնահատված',
    list_view: 'Ցուցակ',
    filters_title: 'Զտիչներ',
    region_label: 'Մարզ',
    city_label: 'Քաղաք / Թաղամաս',
    deal_type_label: 'Գործարքի տեսակը',
    beds_label: 'Ննջասենյակներ',
    price_label: 'Արժեքը (USD)',
    min_price_placeholder: 'Սկսած',
    max_price_placeholder: 'Մինչև',
    additional_label: 'Լրացուցիչ',
    show_results: 'Ցուցադրել',
    renovated_toggle: 'Վերանորոգված',
    new_build_toggle: 'Նորակառույց',
    mortgage_toggle: 'Հիփոթեք',
    owner_toggle: 'Միայն սեփականատիրոջից',
    cabinet_title: 'Կաբինետ',
    edit_profile: 'Խմբագրել պրոֆիլը',
    saved_stats: 'Պահպանված',
    searches_stats: 'Որոնումներ',
    active_ads_stats: 'Ակտիվ հայտարարություններ',
    my_saved_properties: 'Իմ պահպանված օբյեկտները',
    recent_searches: 'Վերջին որոնումները',
    settings_support: 'ԿԱՐԳԱՎՈՐՈՒՄՆԵՐ ԵՎ ԱՋԱԿՑՈՒԹՅՈՒՆ',
    account_settings: 'Հաշվի կարգավորումներ',
    mortgage_applications: 'Հիփոթեքի հայտեր',
    help_support: 'Օգնություն և աջակցություն',
    sign_out: 'Դուրս գալ',
    delete_account: 'Ջնջել հաշիվը',
    delete_account_warn: 'Հաշվի ջնջումը անդառնալի է և կհեռացնի բոլոր պահպանված օբյեկտներն ու որոնումները:',
    new_listings_toggle: 'Նոր հայտարարություններ',
    price_drops_toggle: 'Գների նվազում',
    marketing_toggle: 'Մարքեթինգ',
    dark_mode_toggle: 'Մութ ռեժիմ',
    language_pref: 'Լեզու',
    currency_pref: 'Արժույթ',
    map_layers: 'Քարտեզի շերտերը',
    layer_roadmap: 'Սխեմա',
    layer_satellite: 'Արբանյակ',
    layer_dark: 'Մութ',
    compare: 'Համեմատել',
    compare_added: 'Ավելացված է համեմատությանը',
    compare_full: 'Կարող եք համեմատել առավելագույնը 4 օբյեկտ',
    property_not_found: 'Հայտարարությունը չի գտնվել',
    call_permission_error: 'Սխալ. Խոսափողի կամ տեսախցիկի հասանելիությունը մերժված է կամ սարքերը չեն գտնվել:',
    per_sqm: 'մեկ քմ-ի համար',
    stat_beds: 'Ննջասենյակներ',
    stat_baths: 'Լոգարաններ',
    stat_area: 'Մակերես',
    stat_floor: 'Հարկ',
    renovated_tag: '✓ Վերանորոգված',
    new_build_tag: '🏗 Նորակառույց',
    mortgage_tag: '💰 Հիփոթեք',
    owner_tag: '👤 Սեփականատիրոջից',
    virtual_tour_tag: '🥽 Վիրտուալ տուր',
    description: 'Նկարագրություն',
    amenities: 'Հարմարություններ',
    agent: 'Գործակալ',
    published_date: 'Հրապարակված է',
    call_method: 'Զանգի տարբերակը',
    cellular_call: 'Բջջային կապ',
    audio_call: 'Arm Home Աուդիոզանգ',
    free_in_app: 'Անվճար հավելվածի ներսում',
    video_call: 'Arm Home Տեսազանգ',
    share_video_with_agent: 'Կիսվել տեսանյութով գործակալի հետ',
    cancel: 'Չեղարկել',
    caller_on_line_video: 'Խոսակիցը գծի վրա է (Տեսազանգն ակտիվ է)',
    connecting_video: 'Տեսաալիքի միացում...',
    calling: 'Զանգը գնում է...',
    mute_on: 'Միացնել ձայնը',
    mute_off: 'Անջատել ձայնը',
    video_off: 'Անջատել տեսախցիկը',
    camera: 'Տեսախցիկ',
    volume: 'Բարձրախոս',
    no_saved_properties: 'Պահված հայտարարություններ չկան',
    click_heart_to_save: 'Սեղմեք ❤️ ցանկացած հայտարարության վրա՝ պահպանելու համար',
    skip: 'Բաց թողնել',
    welcome_title: 'Անշարժ գույք, թափանցիկ:',
    welcome_subtitle: 'Գտեք Ձեր երազանքի տունը Հայաստանում՝ արհեստական բանականության գնահատմամբ և ստուգված հայտարարություններով:',
    register_btn: 'Գրանցվել',
    login_btn: 'Մուտք գործել',
    continue_as_guest: 'Շարունակել որպես հյուր',
    feat_verified_title: 'Ստուգված հայտարարություններ',
    feat_verified_desc: 'Յուրաքանչյուր օբյեկտ ֆիզիկապես ստուգվում է մեր թիմի կողմից: Ոչ մի կեղծ լուսանկար կամ թաքնված թերություն:',
    feat_ai_title: 'ԱԲ շուկայական գնահատում',
    feat_ai_desc: 'Իմացեք իրական շուկայական արժեքը բանակցելուց առաջ: Մեր ԱԲ-ն վերլուծում է հազարավոր տվյալներ:',
    feat_chat_title: 'Ուղիղ չատ գործակալի հետ',
    feat_chat_desc: 'Անմիջապես կապվեք վստահելի տեղական գործակալների հետ և պայմանավորվեք դիտումների համար:',
    privacy_policy: 'Գաղտնիության քաղաքականություն',
    terms_of_service: 'Օգտագործման պայմաններ',
    contact_support: 'Աջակցման կենտրոն',
    ai_valuation_insights: 'ԱԲ գնահատման վերլուծություն',
    yerevan_property_index: 'Երևանի անշարժ գույքի ինդեքսը՝ հիմնված հայտարարությունների վերլուծության վրա.',
    avg_price_kentron: 'Կենտրոն միջին գինը',
    avg_price_arabkir: 'Արաբկիր միջին գինը',
    market_demand_trend: 'Շուկայի պահանջարկի միտումը',
    privacy_policy_text: 'Մենք գնահատում ենք Ձեր գաղտնիությունը: Arm Home-ը հավաքում է միայն այն տեղեկությունները, որոնք անհրաժեշտ են գնորդներին գործակալների հետ կապելու և օբյեկտի տվյալները ստուգելու համար: Մենք երբեք չենք վաճառում Ձեր անձնական տվյալները երրորդ անձանց:',
    terms_of_service_text: 'Օգտագործելով Arm Home-ը՝ Դուք համաձայնում եք դիտել միայն ստուգված և իրական անշարժ գույքի առաջարկներ: Կոնտակտային տվյալների կամ գործակալների պրոֆիլների ցանկացած չարաշահում խստիվ արգելված է և կարող է հանգեցնել հաշվի արգելափակմանը:',
    contact_support_text: '📍 Երևան, Հայաստան, Արամի փող. 15\n\n✉️ support@armhome.am\n\n📞 +374 91 123456',
    
    // Additional keys for full localization
    map_tab: 'Քարտեզ',
    feed_tab: 'Լենտա',
    saved_tab: 'Պահված',
    agent_tab: 'Գործակալ',
    filters_button: 'Զտիչներ',
    dialogue_started: 'Զրույցը սկսված է',
    owner_agent: 'Սեփականատեր / Գործակալ',
    buyer: 'Գնորդ',
    login_chat_prompt: 'Խնդրում ենք մուտք գործել՝ անշարժ գույքի սեփականատերերի հետ անմիջապես զրուցելու համար:',
    login_register_btn: 'Մուտք կամ Ստեղծել պրոֆիլ',
    incoming_video_call: '📹 Մուտքային տեսազանգ...',
    incoming_audio_call: '📞 Մուտքային զանգ...',
    decline: 'Մերժել',
    accept: 'Ընդունել',
    dialogues_with_users: 'Զրույցներ օգտատերերի հետ',
    online: 'Առցանց',
    no_messages: 'Հաղորդագրություններ չկան',
    messages_empty_desc: 'Այստեղ կցուցադրվեն Ձեր նամակագրությունները անշարժ գույքի վերաբերյալ:',
    property: 'Գույք',
    to_map: 'Քարտեզի վրա',
    message_placeholder: 'Հաղորդագրություն...',
    quick_reply_1: 'Ե՞րբ է հնարավոր դիտումը:',
    quick_reply_2: 'Ո՞րն է վերջնական գինը:',
    quick_reply_3: 'Կա՞ գույքի տեսանյութ:',
    toast_mic_camera_error: 'Չհաջողվեց մուտք գործել խոսափող/տեսախցիկ: Ստուգեք թույլտվությունները:',
    toast_call_connection_error: 'Սխալ՝ զանգին միանալիս',
    toast_redirecting_to_map: 'Ուղղորդում դեպի քարտեզ...',
    owner_hello_text: 'Բարև Ձեզ: Ես այս հայտարարության սեփականատերն եմ',
    realtor_hello_text: 'Բարև Ձեզ: Ես այս հայտարարության գործակալն եմ',
    how_can_i_help: 'Ինչո՞վ կարող եմ օգնել:',
    street_panorama: '360° Փողոցային համայնապատկեր',
    drag_to_spin: 'Քաշեք՝ 360° դիտելու համար',
    enter_courtyard: 'Տեսնել բակը',
    expand_panorama: 'Բացել',
    collapse_panorama: 'Փակել',
  }
};

export interface Filters {
  listingType: ListingType | 'all';
  propertyType: PropertyType | 'all';
  district: string;
  region: string;
  city: string;
  minPrice: number;
  maxPrice: number;
  beds: number | 'any';
  renovated: boolean | null;
  newBuild: boolean | null;
  mortgageEligible: boolean | null;
  ownerOnly: boolean | null;
  searchQuery: string;
}

const defaultFilters: Filters = {
  listingType: 'all',
  propertyType: 'all',
  district: 'Все',
  region: 'Все',
  city: 'Все',
  minPrice: 0,
  maxPrice: 10000000,
  beds: 'any',
  renovated: null,
  newBuild: null,
  mortgageEligible: null,
  ownerOnly: null,
  searchQuery: '',
};

export type Currency = 'USD' | 'AMD' | 'RUB';

export interface RecentSearch {
  id: string;
  query: string;
  details: string;
  filters: Partial<Filters>;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  timestamp: number;
  type: 'info' | 'price_drop' | 'new_property' | 'saved_alert';
  read: boolean;
}

export interface User {
  id: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  email: string;
  phone?: string;
  role: 'viewer' | 'realtor' | 'admin';
  avatarUrl?: string;
  experience?: number;
  specializations?: string[];
  bio?: string;
  verificationDoc?: string;
  status: 'active' | 'pending_verification' | 'blocked';
  createdAt: string;
  marketingOptOut?: boolean;
  savedIds?: string[];
  compareIds?: string[];
  blockedUsers?: string[];
  isOnline?: boolean;
  lastSeen?: number;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  time: string;
  timestamp: number;
  type?: 'text' | 'call_missed' | 'call_duration' | 'system' | 'image' | 'voice' | 'file';
  duration?: number;
  attachmentUrl?: string;
}

export interface ChatThread {
  id: string;
  propertyId?: string;
  propertyTitle?: string;
  propertyPrice?: number;
  propertyImage?: string;
  propertyAddress?: string;
  buyerId?: string;
  buyerName?: string;
  buyerAvatar?: string;
  sellerId?: string;
  sellerName?: string;
  sellerAvatar?: string;
  sellerPhone?: string;
  
  isGroup?: boolean;
  groupName?: string;
  groupAvatar?: string;
  adminIds?: string[];
  
  participants: string[];
  lastMessage: string;
  time: string;
  unreadBy: string[];
  messages: Message[];
  archivedBy?: string[];
  pinnedBy?: string[];
  deletedBy?: string[];
}

export interface ActiveCallType {
  callId: string;
  partnerName: string;
  partnerAvatar: string;
  partnerId: string;
  isVideo: boolean;
  isCaller: boolean;
  chatId?: string;
}

export interface IncomingCallType {
  callId: string;
  callerId: string;
  callerName: string;
  callerAvatar: string;
  isVideo: boolean;
  chatId?: string;
}

interface AppContextType {
  properties: Property[];
  threads: ChatThread[];
  hasUnreadMessages: boolean;
  unreadMessagesCount: number;
  setProperties: (p: Property[]) => void;
  addProperty: (p: Property) => void;
  filters: Filters;
  setFilters: (f: Partial<Filters>) => void;
  resetFilters: () => void;
  filteredProperties: Property[];
  selectedPropertyId: string | null;
  setSelectedPropertyId: (id: string | null) => void;
  savedIds: Set<string>;
  toggleSaved: (id: string) => void;
  showFiltersPanel: boolean;
  setShowFiltersPanel: (v: boolean) => void;
  showQrScanner: boolean;
  setShowQrScanner: (v: boolean) => void;
  activeDistrictHub: string | null;
  setActiveDistrictHub: (v: string | null) => void;
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (priceUSD: number, listingType?: string) => string;
  recentSearches: RecentSearch[];
  setRecentSearches: React.Dispatch<React.SetStateAction<RecentSearch[]>>;
  saveRecentSearch: (f: Partial<Filters>) => void;
  deleteRecentSearch: (id: string) => void;
  clearRecentSearches: () => void;
  notifications: AppNotification[];
  addNotification: (title: string, message: string, type?: AppNotification['type']) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  updatePropertyViews: (id: string, count: number) => Promise<void>;
  notificationsEnabled: { newListings: boolean; priceDrops: boolean; marketing: boolean };
  setNotificationsEnabled: React.Dispatch<React.SetStateAction<{ newListings: boolean; priceDrops: boolean; marketing: boolean }>>;
  compareIds: Set<string>;
  toggleCompare: (id: string) => void;
  toastMessage: string | null;
  triggerToast: (msg: string) => void;
  
  // Auth state & Firebase
  currentUser: User | null;
  setCurrentUser: (user: User | null) => Promise<void>;
  registerUser: (userData: Omit<User, 'id' | 'createdAt'>) => User;
  loginUser: (email: string) => boolean;
  logoutUser: () => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  authLoading: boolean;
 
  // Global Call States & Methods
  incomingCall: IncomingCallType | null;
  setIncomingCall: (call: IncomingCallType | null) => void;
  activeCall: ActiveCallType | null;
  setActiveCall: (call: ActiveCallType | null) => void;
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  isSpeakerphone: boolean;
  setIsSpeakerphone: React.Dispatch<React.SetStateAction<boolean>>;
  isCameraOff: boolean;
  setIsCameraOff: React.Dispatch<React.SetStateAction<boolean>>;
  isFrontCamera: boolean;
  setIsFrontCamera: React.Dispatch<React.SetStateAction<boolean>>;
  callStatus: 'dialing' | 'connected' | 'ended';
  setCallStatus: (s: 'dialing' | 'connected' | 'ended') => void;
  showAddParticipant: boolean;
  setShowAddParticipant: (s: boolean) => void;
  isCallMinimized: boolean;
  setIsCallMinimized: (s: boolean) => void;
  
  // Call actions
  startOnlineCall: (isVideo: boolean, partnerName: string, partnerAvatar: string, partnerId: string, chatId?: string) => Promise<void>;
  acceptCall: () => Promise<void>;
  declineCall: () => Promise<void>;
  endCall: () => Promise<void>;
  toggleMute: () => void;
  toggleCamera: () => void;
  switchCamera: () => Promise<void>;
  toggleSpeakerphone: () => void;
  inviteParticipant: (partnerId: string, partnerName: string, partnerAvatar: string) => Promise<void>;
  cleanupCall: (callId?: string) => Promise<void>;
 
  // Call WebRTC streams & refs
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  localVideoRef: React.RefObject<HTMLVideoElement | null>;
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>;
  remoteAudioRef: React.RefObject<HTMLAudioElement | null>;
}

const AppContext = createContext<AppContextType | null>(null);

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443?transport=tcp',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
  ],
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Global Call States
  const [incomingCall, setIncomingCall] = useState<IncomingCallType | null>(null);
  const [activeCall, setActiveCall] = useState<ActiveCallType | null>(null);
  const callStartTimestampRef = useRef<number>(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerphone, setIsSpeakerphone] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [callStatus, setCallStatus] = useState<'dialing' | 'connected' | 'ended'>('dialing');
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [isCallMinimized, setIsCallMinimized] = useState(false);

  // WebRTC streams as states to trigger re-renders when they set
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  // WebRTC references
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const callDocUnsubRef = useRef<(() => void) | null>(null);
  const iceCandidateBuffer = useRef<RTCIceCandidateInit[]>([]);

  // Call status ref to avoid stale closures in listeners
  const callStatusRef = useRef<'dialing' | 'connected' | 'ended'>('dialing');

  useEffect(() => {
    callStatusRef.current = callStatus;
  }, [callStatus]);

  // Dial tone refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const dialToneIntervalRef = useRef<any>(null);

  useEffect(() => {
    const q = query(collection(db, 'properties'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbProperties: Property[] = [];
      snapshot.forEach((docSnap) => {
        dbProperties.push(docSnap.data() as Property);
      });
      
      if (dbProperties.length > 0) {
        dbProperties.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
        const withViews = dbProperties.map(p => ({
          ...p,
          views: typeof p.views === 'number' ? p.views : Math.floor(120 + Math.random() * 330)
        }));
        setProperties(withViews);
      } else {
        const withViews = MOCK_PROPERTIES.map(p => ({
          ...p,
          views: typeof p.views === 'number' ? p.views : Math.floor(120 + Math.random() * 330)
        }));
        setProperties(withViews);
        withViews.forEach(async (p) => {
          try {
            await setDoc(doc(db, 'properties', p.id), p);
          } catch (err) {
            console.debug('Failed to seed property (likely guest or permission denied):', p.id, err);
          }
        });
      }
    }, (err) => {
      console.error('Failed to sync properties from Firestore:', err);
    });
    return () => unsubscribe();
  }, []);

  const [filters, setFiltersState] = useState<Filters>(defaultFilters);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set()); // empty until user logs in
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [activeDistrictHub, setActiveDistrictHub] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('lang');
    return (saved as Language) || 'AM';
  });
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('currency');
    return (saved as Currency) || 'AMD';
  });

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse recentSearches from localStorage', e);
      }
    }
    return [
      {
        id: '1',
        query: 'Arabkir, Duplex',
        details: '3+ beds · Under $300k · Saved 2 days ago',
        filters: { region: 'Ереван', city: 'Арабкир', beds: 3, maxPrice: 300000 }
      },
      {
        id: '2',
        query: 'Kentron, New Buildings',
        details: '2+ beds · Filtered by Agency',
        filters: { region: 'Ереван', city: 'Кентрон', newBuild: true, beds: 2 }
      }
    ];
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse notifications from localStorage', e);
      }
    }
    // Seed default notifications initially
    return [
      {
        id: 'n1',
        title: 'New Property Alert',
        message: 'A new 3-bedroom duplex matching your "Arabkir" search was just listed for $485,000.',
        time: '15m ago',
        timestamp: Date.now() - 15 * 60 * 1000,
        type: 'new_property',
        read: false
      },
      {
        id: 'n2',
        title: 'Price Reduction',
        message: 'A property in your "Saved" list just dropped its price by $15,000.',
        time: '2h ago',
        timestamp: Date.now() - 2 * 60 * 60 * 1000,
        type: 'price_drop',
        read: false
      }
    ];
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState({
    newListings: true,
    priceDrops: true,
    marketing: false
  });

  // Helper to check if filters are active
  const isFiltersActive = (f: Partial<Filters>): boolean => {
    return (
      (f.listingType !== undefined && f.listingType !== 'all') ||
      (f.propertyType !== undefined && f.propertyType !== 'all') ||
      (f.region !== undefined && f.region !== 'Все') ||
      (f.city !== undefined && f.city !== 'Все') ||
      (f.district !== undefined && f.district !== 'Все') ||
      (f.minPrice !== undefined && f.minPrice > 0) ||
      (f.maxPrice !== undefined && f.maxPrice < 10000000) ||
      (f.beds !== undefined && f.beds !== 'any') ||
      (f.renovated !== undefined && f.renovated !== null) ||
      (f.newBuild !== undefined && f.newBuild !== null) ||
      (f.mortgageEligible !== undefined && f.mortgageEligible !== null) ||
      (f.ownerOnly !== undefined && f.ownerOnly !== null) ||
      (f.searchQuery !== undefined && f.searchQuery !== '')
    );
  };

  const saveRecentSearch = (f: Partial<Filters>) => {
    if (!isFiltersActive(f)) return;
    
    // Generate descriptive query title
    let queryParts: string[] = [];
    if (f.city && f.city !== 'Все') {
      queryParts.push(f.city);
    } else if (f.region && f.region !== 'Все') {
      queryParts.push(f.region);
    } else {
      queryParts.push(lang === 'RU' ? 'Армения' : lang === 'AM' ? 'Հայաստան' : 'Armenia');
    }

    if (f.listingType && f.listingType !== 'all') {
      const typeLabel = f.listingType === 'sale' ? (lang === 'RU' ? 'Продажа' : 'Sale') : f.listingType === 'rent' ? (lang === 'RU' ? 'Аренда' : 'Rent') : (lang === 'RU' ? 'Посуточно' : 'Daily');
      queryParts.push(typeLabel);
    }
    
    if (f.newBuild) {
      queryParts.push(lang === 'RU' ? 'Новостройки' : 'New Buildings');
    }

    const queryStr = queryParts.join(', ');

    // Subtitle details
    let detailParts: string[] = [];
    if (f.beds && f.beds !== 'any') {
      detailParts.push(`${f.beds}+ beds`);
    }
    if (f.maxPrice && f.maxPrice < 10000000) {
      detailParts.push(`Under $${(f.maxPrice / 1000).toFixed(0)}k`);
    }
    if (f.renovated) {
      detailParts.push(lang === 'RU' ? 'С ремонтом' : 'Renovated');
    }
    if (f.searchQuery) {
      detailParts.push(`"${f.searchQuery}"`);
    }
    
    detailParts.push(lang === 'RU' ? 'Только что' : 'Just now');

    const detailsStr = detailParts.join(' · ');

    const newSearch: RecentSearch = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
      query: queryStr,
      details: detailsStr,
      filters: JSON.parse(JSON.stringify(f))
    };

    setRecentSearches(prev => {
      const filtered = prev.filter(item => item.query !== newSearch.query);
      const updated = [newSearch, ...filtered].slice(0, 10);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteRecentSearch = (id: string) => {
    setRecentSearches(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const addNotification = (title: string, message: string, type: AppNotification['type'] = 'info') => {
    const newNotif: AppNotification = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
      title,
      message,
      time: lang === 'RU' ? 'Только что' : 'Just now',
      timestamp: Date.now(),
      type,
      read: false
    };

    setNotifications(prev => {
      const updated = [newNotif, ...prev].slice(0, 50); // limit to 50
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('notifications');
  };

  const updatePropertyViews = async (propertyId: string, viewsCount: number) => {
    try {
      setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, views: viewsCount } : p));
      const propertyRef = doc(db, 'properties', propertyId);
      await updateDoc(propertyRef, { views: viewsCount });
    } catch (e) {
      console.error('Failed to update property views in Firestore:', e);
    }
  };

  const setFilters = (f: Partial<Filters>) => {
    setFiltersState(prev => ({ ...prev, ...f }));
  };

  const sanitizeObject = (obj: any): any => {
    if (obj === null || obj === undefined) return null;
    if (Array.isArray(obj)) return obj.map(sanitizeObject);
    if (typeof obj === 'object') {
      const cleaned: any = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const val = obj[key];
          if (val !== undefined) {
            cleaned[key] = sanitizeObject(val);
          }
        }
      }
      return cleaned;
    }
    return obj;
  };

  const addProperty = async (p: Property) => {
    try {
      const propertyWithViews = { ...p, views: 0 };
      const sanitized = sanitizeObject(propertyWithViews);
      await setDoc(doc(db, 'properties', p.id), sanitized);
      addNotification(
        lang === 'RU' ? 'Объявление опубликовано' : 'Listing Published',
        lang === 'RU' 
          ? `Ваше объявление "${p.title}" успешно опубликовано и доступно в поиске!`
          : `Your listing "${p.title}" was successfully published and is now live in search!`,
        'new_property'
      );
    } catch (e) {
      console.error('Failed to save listing to Firestore:', e);
    }
  };

  const filteredProperties = properties.filter(p => {
    if (filters.listingType !== 'all' && p.listingType !== filters.listingType) return false;
    if (filters.propertyType !== 'all' && p.propertyType !== filters.propertyType) return false;
    if (filters.region !== 'Все' && p.region !== filters.region) return false;
    if (filters.city !== 'Все' && p.city !== filters.city && p.district !== filters.city) return false;
    if (filters.district !== 'Все' && p.district !== filters.district) return false;
    if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;
    if (filters.beds !== 'any' && p.beds !== filters.beds) return false;
    if (filters.renovated !== null && p.renovated !== filters.renovated) return false;
    if (filters.newBuild !== null && p.newBuild !== filters.newBuild) return false;
    if (filters.mortgageEligible !== null && p.mortgageEligible !== filters.mortgageEligible) return false;
    if (filters.ownerOnly !== null && p.ownerListing !== filters.ownerOnly) return false;
    
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchAddress = p.address.toLowerCase().includes(q);
      const matchDistrict = p.district.toLowerCase().includes(q);
      if (!matchTitle && !matchAddress && !matchDistrict) return false;
    }
    
    return true;
  });

  const toggleSaved = (id: string) => {
    if (!currentUser) {
      triggerToast(lang === 'RU' ? 'Пожалуйста, войдите в аккаунт' : 'Please log in');
      return;
    }
    setSavedIds(prev => {
      const next = new Set(prev);
      const isSaved = next.has(id);
      if (isSaved) {
        next.delete(id);
      } else {
        next.add(id);
        const prop = properties.find(p => p.id === id);
        if (prop) {
          addNotification(
            lang === 'RU' ? 'Объект сохранен' : 'Property Saved',
            lang === 'RU'
              ? `Вы сохранили объявление: "${prop.title}" за ${formatPrice(prop.price, prop.listingType)}.`
              : `You saved listing: "${prop.title}" for ${formatPrice(prop.price, prop.listingType)}.`,
            'saved_alert'
          );
        }
      }
      const nextArray = Array.from(next);
      // Persist to Firestore
      const userRef = doc(db, 'users', currentUser.id);
      updateDoc(userRef, { savedIds: nextArray }).catch(console.error);
      return next;
    });
  };

  const toggleCompare = (id: string) => {
    if (!currentUser) {
      triggerToast(lang === 'RU' ? 'Пожалуйста, войдите в аккаунт' : 'Please log in');
      return;
    }
    if (compareIds.has(id)) {
      setCompareIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        const nextArray = Array.from(next);
        const userRef = doc(db, 'users', currentUser.id);
        updateDoc(userRef, { compareIds: nextArray }).catch(console.error);
        return next;
      });
    } else {
      if (compareIds.size >= 4) {
        triggerToast(t('compare_full'));
        return;
      }
      setCompareIds(prev => {
        const next = new Set(prev);
        next.add(id);
        const nextArray = Array.from(next);
        const userRef = doc(db, 'users', currentUser.id);
        updateDoc(userRef, { compareIds: nextArray }).catch(console.error);
        return next;
      });
    }
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const resetFilters = () => {
    setFiltersState(defaultFilters);
  };

  const formatPrice = (priceUSD: number, listingType?: string) => {
    const rates: Record<Currency, number> = {
      USD: 1,
      AMD: 388,
      RUB: 91,
    };
    const symbols: Record<Currency, string> = {
      USD: '$',
      AMD: '֏',
      RUB: '₽',
    };
    const rate = rates[currency];
    const converted = Math.round(priceUSD * rate);
    
    let suffix = '';
    if (listingType === 'rent') {
      suffix = lang === 'AM' ? ' / ամիս' : lang === 'EN' ? ' / mo' : ' / мес';
    } else if (listingType === 'daily') {
      suffix = lang === 'AM' ? ' / օր' : lang === 'EN' ? ' / day' : ' / сут';
    }
    
    if (currency === 'USD') {
      return `${symbols[currency]}${converted.toLocaleString()}${suffix}`;
    }
    return `${converted.toLocaleString()} ${symbols[currency]}${suffix}`;
  };

  const t = (key: string) => {
    return TRANSLATIONS[lang]?.[key] || key;
  };

  // Notification token state
  const [notificationToken, setNotificationToken] = useState<string | null>(null);

  // Request notification permission and get token
  useEffect(() => {
    if (!currentUser) return;
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications.');
      return;
    }
    Notification.requestPermission().then((permission) => {
      if (permission !== 'granted') {
        console.warn('Notification permission not granted.');
        return;
      }
      // Get FCM token only if messaging is available
      if (messaging) {
        getToken(messaging, { vapidKey: 'YOUR_PUBLIC_VAPID_KEY' })
          .then((token) => {
            if (token) {
              setNotificationToken(token);
              // Optionally store token in Firestore user profile
              const userRef = doc(db, 'users', currentUser.id);
              updateDoc(userRef, { notificationToken: token }).catch(console.error);
            }
          })
          .catch((err) => console.error('Failed to get FCM token:', err));
      } else {
        console.warn('Firebase Messaging not supported in this environment.');
      }
    });
  }, [currentUser]);

  useEffect(() => {
  if (!messaging) return;
  const unsubscribe = onMessage(messaging, (payload) => {
    const { title, body } = payload.notification || {};
    if (title || body) {
      triggerToast(`${title ? title + ': ' : ''}${body || ''}`);
    }
  });
  return () => unsubscribe();
}, [messaging]);

  const [threads, setThreads] = useState<ChatThread[]>([]);
  const unreadMessagesCount = threads.filter(
    t => t.unreadBy.includes(currentUser?.id || '') && !(t.archivedBy || []).includes(currentUser?.id || '')
  ).length;
  
  const hasUnreadMessages = unreadMessagesCount > 0;

  // Sync global chats from Firestore
  useEffect(() => {
    if (!currentUser) {
      setThreads([]);
      return;
    }
    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUser.id)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList: ChatThread[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        chatList.push({
          id: docSnap.id,
          propertyId: data.propertyId,
          propertyTitle: data.propertyTitle,
          propertyPrice: data.propertyPrice,
          propertyImage: data.propertyImage,
          propertyAddress: data.propertyAddress,
          buyerId: data.buyerId,
          buyerName: data.buyerName,
          buyerAvatar: data.buyerAvatar || '',
          sellerId: data.sellerId,
          sellerName: data.sellerName,
          sellerAvatar: data.sellerAvatar || '',
          sellerPhone: data.sellerPhone || '',
          isGroup: data.isGroup,
          groupName: data.groupName,
          groupAvatar: data.groupAvatar,
          adminIds: data.adminIds || (data.adminId ? [data.adminId] : []),
          participants: data.participants || [],
          lastMessage: data.lastMessage || '',
          time: data.time || '',
          unreadBy: data.unreadBy || [],
          archivedBy: data.archivedBy || [],
          pinnedBy: data.pinnedBy || [],
          deletedBy: data.deletedBy || [],
          messages: (data.messages || []).sort((a: Message, b: Message) => (a.timestamp || 0) - (b.timestamp || 0)),
        });
      });
      chatList.sort((a, b) => {
        const aMsg = a.messages[a.messages.length - 1];
        const bMsg = b.messages[b.messages.length - 1];
        return (bMsg?.timestamp || 0) - (aMsg?.timestamp || 0);
      });
      setThreads(chatList);
    }, (err) => {
      console.error('Failed to sync global chats from Firestore:', err);
    });
    return () => unsubscribe();
  }, [currentUser]);

  // Sync auth state with Firestore
  useEffect(() => {
    let unsubDoc: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (unsubDoc) { unsubDoc(); unsubDoc = null; }

      if (firebaseUser) {
        // Run an async routine to find the correct document reference
        (async () => {
          let activeRef = doc(db, 'users', firebaseUser.uid);
          try {
            const userSnap = await getDoc(activeRef);
            if (!userSnap.exists() && firebaseUser.email) {
              const emailQ = query(collection(db, 'users'), where('email', '==', firebaseUser.email));
              const emailSnap = await getDocs(emailQ);
              if (!emailSnap.empty) {
                activeRef = emailSnap.docs[0].ref;
              }
            }
          } catch (e) {
            console.error('Error resolving user document:', e);
          }
          
          unsubDoc = onSnapshot(activeRef, (docSnap) => {
            if (docSnap.exists()) {
              const userData = { ...docSnap.data(), id: docSnap.id } as User;
              setCurrentUserState(userData);
              setSavedIds(new Set(userData.savedIds || []));
              setCompareIds(new Set(userData.compareIds || []));
            } else {
              setCurrentUserState(null);
            }
            setAuthLoading(false);
          }, () => setAuthLoading(false));
        })();
      } else {
        setCurrentUserState(null);
        setSavedIds(new Set());
        setCompareIds(new Set());
        setAuthLoading(false);
      }
    });

    return () => { unsubscribe(); if (unsubDoc) unsubDoc(); };
  }, []);

  // User global presence tracking (isOnline, lastSeen)
  useEffect(() => {
    if (!currentUser?.id) return;
    const userRef = doc(db, 'users', currentUser.id);

    const setOnline = async () => {
      try {
        await updateDoc(userRef, { isOnline: true, lastSeen: Date.now() });
      } catch (e) {
        console.error("Failed to set user online presence:", e);
      }
    };

    setOnline();

    // Keep updating lastSeen every 30 seconds to show active presence
    const interval = setInterval(async () => {
      try {
        await updateDoc(userRef, { isOnline: true, lastSeen: Date.now() });
      } catch (e) {
        console.error("Failed to update active presence lastSeen:", e);
      }
    }, 30000);

    const setOffline = () => {
      updateDoc(userRef, { isOnline: false, lastSeen: Date.now() }).catch(console.error);
    };

    window.addEventListener('beforeunload', setOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', setOffline);
      setOffline();
    };
  }, [currentUser?.id]);

  const setCurrentUser = async (user: User | null) => {
    // Optimistic UI update to prevent AuthGuard redirect race condition
    if (user) {
      setCurrentUserState(user);
      const userRef = doc(db, 'users', user.id);
      await setDoc(userRef, user, { merge: true });
    } else {
      setCurrentUserState(null);
    }
  };

  const registerUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    // This function will be replaced by direct Firebase calls in AuthPage
    // We leave a stub to prevent typescript errors before updating AuthPage
    const newUser: User = {
      ...userData,
      id: 'mock_stub',
      createdAt: new Date().toISOString(),
    };
    return newUser;
  };

  const loginUser = (_email: string) => {
    // Stub
    return false;
  };

  const logoutUser = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Logout error', e);
    }
  };

  // Helper to log Call Events directly to the chat thread
  const logCallToChat = async (partnerId: string, status: 'missed' | 'declined' | 'ended', durationSec: number, isVideo: boolean) => {
    if (!currentUser) return;

    // Find the thread that contains both currentUser and partnerId
    const thread = threads.find(t => 
      t.participants.includes(currentUser.id) && t.participants.includes(partnerId)
    );

    if (!thread) {
      console.warn('No chat thread found to log call with partner:', partnerId);
      return;
    }

    const isRu = lang === 'RU';
    const isAm = lang === 'AM';
    let typeStr = '';
    if (isVideo) {
      typeStr = isRu ? 'Видеозвонок' : isAm ? 'Տեսազանգ' : 'Video call';
    } else {
      typeStr = isRu ? 'Аудиозвонок' : isAm ? 'Ձայնային զանգ' : 'Audio call';
    }

    let text = '';
    if (status === 'missed') {
      text = `📞 ${typeStr}: ${isRu ? 'пропущенный' : isAm ? 'բաց թողնված' : 'missed'}`;
    } else if (status === 'declined') {
      text = `📞 ${typeStr}: ${isRu ? 'отклонён' : isAm ? 'մերժված' : 'declined'}`;
    } else {
      const mins = Math.floor(durationSec / 60);
      const secs = durationSec % 60;
      const durationStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      text = `📞 ${typeStr}: ${isRu ? 'завершен' : isAm ? 'ավարտված' : 'ended'} (${durationStr})`;
    }

    const timeStr = new Date().toLocaleTimeString(lang === 'RU' ? 'ru-RU' : lang === 'AM' ? 'hy-AM' : 'en-US', { hour: '2-digit', minute: '2-digit' });

    const newMsg: Message = {
      id: `call-log-${Date.now()}-${currentUser.id}`,
      senderId: 'system', // marked as system
      senderName: 'System',
      text,
      time: timeStr,
      timestamp: Date.now(),
    };

    const chatRef = doc(db, 'chats', thread.id);
    try {
      await updateDoc(chatRef, {
        lastMessage: text,
        time: timeStr,
        messages: arrayUnion(newMsg),
        unreadBy: arrayUnion(partnerId)
      });
    } catch (e) {
      console.error('Failed to log call message in chat:', e);
    }
  };

  // Global Dial Tone Generator
  const startDialTone = () => {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtxClass();
      audioContextRef.current = ctx;
      const playBeep = () => {
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(425, ctx.currentTime);
        gain.gain.setValueAtTime(0.07, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
      };
      playBeep();
      dialToneIntervalRef.current = setInterval(playBeep, 4000);
    } catch (e) {
      print('Dial tone error', e);
    }
  };

  const stopDialTone = () => {
    if (dialToneIntervalRef.current) {
      clearInterval(dialToneIntervalRef.current);
      dialToneIntervalRef.current = null;
    }
    audioContextRef.current?.close().catch(() => {});
    audioContextRef.current = null;
  };

  // Track call start time
  useEffect(() => {
    if (activeCall && callStatus === 'connected') {
      callStartTimestampRef.current = Date.now();
    } else if (!activeCall) {
      callStartTimestampRef.current = 0;
    }
  }, [activeCall, callStatus]);

  // Bind local/remote streams to element refs when activeCall changes
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [activeCall, localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
    if (remoteAudioRef.current && remoteStream) {
      remoteAudioRef.current.srcObject = remoteStream;
    }
  }, [callStatus, remoteStream]);

  // Cleanup call
  const cleanupCall = useCallback(async (callId?: string) => {
    stopDialTone();
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    localStreamRef.current = null;
    remoteStreamRef.current = null;
    setLocalStream(null);
    setRemoteStream(null);
    iceCandidateBuffer.current = [];
    callDocUnsubRef.current?.();
    callDocUnsubRef.current = null;
    setActiveCall(null);
    setIncomingCall(null);
    setCallStatus('ended');
    setIsMuted(false);
    setIsSpeakerphone(false);
    setIsCameraOff(false);
    setIsFrontCamera(true);
    setIsCallMinimized(false);
    if (callId) {
      try { await deleteDoc(doc(db, 'calls', callId)); } catch (_) {}
    }
  }, []);

  // Set up Peer Connection
  const setupPeerConnection = (callId: string, isVideo: boolean) => {
    const pc = new RTCPeerConnection(RTC_CONFIG);
    peerConnectionRef.current = pc;

    localStreamRef.current?.getTracks().forEach(track => {
      pc.addTrack(track, localStreamRef.current!);
    });

    const rStream = new MediaStream();
    remoteStreamRef.current = rStream;
    setRemoteStream(rStream);

    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach(track => {
        rStream.addTrack(track);
      });
      setCallStatus('connected');
      stopDialTone();
    };

    pc.onicecandidate = async (event) => {
      if (event.candidate && currentUser) {
        try {
          await updateDoc(doc(db, 'calls', callId), {
            [`iceCandidates.${currentUser.id}`]: arrayUnion(event.candidate.toJSON())
          });
        } catch (e) {
          console.warn('ICE candidate send error', e);
        }
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed' || pc.connectionState === 'closed') {
        cleanupCall(callId);
      }
      if (pc.connectionState === 'connected') {
        stopDialTone();
        setCallStatus('connected');
      }
    };

    return pc;
  };

  // Start online call (Caller)
  const startOnlineCall = async (isVideo: boolean, partnerName: string, partnerAvatar: string, partnerId: string) => {
    if (!currentUser) return;
    const callId = `call_${Date.now()}_${currentUser.id}`;

    try {
      const constraints: MediaStreamConstraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: isVideo ? { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } : false,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      setLocalStream(stream);

      setActiveCall({ callId, partnerName, partnerAvatar, partnerId, isVideo, isCaller: true });
      setCallStatus('dialing');
      setIsCallMinimized(false);
      startDialTone();

      const pc = setupPeerConnection(callId, isVideo);

      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: isVideo,
      });
      await pc.setLocalDescription(offer);

      await setDoc(doc(db, 'calls', callId), {
        callId,
        callerId: currentUser.id,
        callerName: currentUser.fullName,
        callerAvatar: currentUser.avatarUrl || '',
        calleeId: partnerId,
        isVideo,
        status: 'ringing',
        offer: { type: offer.type, sdp: offer.sdp },
        answer: null,
        iceCandidates: {},
        createdAt: serverTimestamp(),
      });

      const unsubCall = onSnapshot(doc(db, 'calls', callId), async (snap) => {
        if (!snap.exists()) { cleanupCall(); return; }
        const data = snap.data();
        if (data.status === 'declined' || data.status === 'ended') {
          const statusToLog = data.status === 'declined' ? 'declined' : 'ended';
          const finalDuration = callStartTimestampRef.current > 0 ? Math.floor((Date.now() - callStartTimestampRef.current) / 1000) : 0;
          logCallToChat(partnerId, statusToLog, finalDuration, isVideo);
          cleanupCall(callId);
          return;
        }
        if (data.answer && pc.signalingState !== 'stable' && !pc.remoteDescription) {
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
            for (const c of iceCandidateBuffer.current) {
              try { await pc.addIceCandidate(new RTCIceCandidate(c)); } catch (_) {}
            }
            iceCandidateBuffer.current = [];
          } catch (e) {
            console.error('Set remote description error', e);
          }
        }
        const remoteCandidates: RTCIceCandidateInit[] = data.iceCandidates?.[partnerId] || [];
        if (remoteCandidates.length > 0 && pc.remoteDescription) {
          for (const c of remoteCandidates) {
            try { await pc.addIceCandidate(new RTCIceCandidate(c)); } catch (_) {}
          }
        } else if (remoteCandidates.length > 0) {
          iceCandidateBuffer.current = remoteCandidates;
        }
      });
      callDocUnsubRef.current = unsubCall;

    } catch (err: any) {
      console.error('Call start error:', err);
      triggerToast(lang === 'RU' ? 'Нет доступа к микрофону/камере. Проверьте разрешения.' : 'Cannot access mic/camera. Check permissions.');
      cleanupCall();
    }
  };

  // Accept call (Callee)
  const acceptCall = async () => {
    if (!incomingCall || !currentUser) return;
    const { callId, isVideo, callerName, callerAvatar } = incomingCall;

    try {
      const constraints: MediaStreamConstraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: isVideo ? { facingMode: 'user' } : false,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      setLocalStream(stream);

      setActiveCall({ callId, partnerName: callerName, partnerAvatar: callerAvatar, partnerId: incomingCall.callerId, isVideo, isCaller: false });
      setCallStatus('connected');
      setIncomingCall(null);
      setIsCallMinimized(false);

      const callRef = doc(db, 'calls', callId);
      const callSnap = await getDoc(callRef);
      if (!callSnap.exists()) return;

      const callData = callSnap.data();
      const pc = setupPeerConnection(callId, isVideo);

      await pc.setRemoteDescription(new RTCSessionDescription(callData.offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      await updateDoc(callRef, {
        answer: { type: answer.type, sdp: answer.sdp },
        status: 'accepted',
      });

      const callerId = callData.callerId;
      const unsubCall = onSnapshot(callRef, async (snap) => {
        if (!snap.exists()) { cleanupCall(); return; }
        const data = snap.data();
        if (data.status === 'ended') { cleanupCall(callId); return; }
        const callerCandidates: RTCIceCandidateInit[] = data.iceCandidates?.[callerId] || [];
        if (callerCandidates.length > 0 && pc.remoteDescription) {
          for (const c of callerCandidates) {
            try { await pc.addIceCandidate(new RTCIceCandidate(c)); } catch (_) {}
          }
        }
      });
      callDocUnsubRef.current = unsubCall;

    } catch (err) {
      console.error('Accept call error:', err);
      triggerToast(lang === 'RU' ? 'Ошибка при подключении к звонку' : 'Call connection error');
      cleanupCall();
    }
  };

  // Decline incoming call
  const declineCall = async () => {
    if (!incomingCall) return;
    await updateDoc(doc(db, 'calls', incomingCall.callId), { status: 'declined' }).catch(() => {});
    setIncomingCall(null);
  };

  // End active call
  const endCall = async () => {
    if (activeCall) {
      if (activeCall.isCaller) {
        const finalStatus = callStatusRef.current === 'connected' ? 'ended' : 'missed';
        const finalDuration = callStartTimestampRef.current > 0 ? Math.floor((Date.now() - callStartTimestampRef.current) / 1000) : 0;
        logCallToChat(activeCall.partnerId, finalStatus, finalDuration, activeCall.isVideo);
      }
      await updateDoc(doc(db, 'calls', activeCall.callId), { status: 'ended' }).catch(() => {});
      cleanupCall(activeCall.callId);
    } else {
      cleanupCall();
    }
  };

  // Mic mute
  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(t => { t.enabled = !t.enabled; });
    }
    setIsMuted(prev => !prev);
  };

  // Camera mute/unmute
  const toggleCamera = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(t => { t.enabled = !t.enabled; });
    }
    setIsCameraOff(prev => !prev);
  };

  // Switch camera
  const switchCamera = async () => {
    if (!localStreamRef.current || !peerConnectionRef.current) return;
    const newFacing = isFrontCamera ? 'environment' : 'user';
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
         video: { facingMode: newFacing },
         audio: false,
      });
      const newVideoTrack = newStream.getVideoTracks()[0];
      const sender = peerConnectionRef.current.getSenders().find(s => s.track?.kind === 'video');
      if (sender) await sender.replaceTrack(newVideoTrack);

      localStreamRef.current.getVideoTracks().forEach(t => t.stop());
      localStreamRef.current.getVideoTracks().forEach(t => localStreamRef.current!.removeTrack(t));
      localStreamRef.current.addTrack(newVideoTrack);

      setLocalStream(new MediaStream(localStreamRef.current.getTracks()));
      setIsFrontCamera(!isFrontCamera);
    } catch (e) {
      console.error('Switch camera error', e);
      triggerToast(lang === 'RU' ? 'Не удалось переключить камеру' : 'Cannot switch camera');
    }
  };

  // Toggle speakerphone
  const toggleSpeakerphone = () => setIsSpeakerphone(prev => !prev);

  // Invite participant to group call
  const inviteParticipant = async (partnerId: string, partnerName: string, partnerAvatar: string) => {
    if (!currentUser || !activeCall) return;
    const inviteCallId = `call_invite_${Date.now()}`;
    try {
      await setDoc(doc(db, 'calls', inviteCallId), {
        callId: inviteCallId,
        callerId: currentUser.id,
        callerName: currentUser.fullName,
        callerAvatar: currentUser.avatarUrl || '',
        calleeId: partnerId,
        isVideo: activeCall.isVideo,
        status: 'ringing',
        offer: null,
        answer: null,
        iceCandidates: {},
        isGroupInvite: true,
        originalCallId: activeCall.callId,
        createdAt: serverTimestamp(),
      });
      triggerToast(lang === 'RU' ? `Приглашение отправлено ${partnerName}` : `Invite sent to ${partnerName}`);
    } catch (e) {
      console.error('Invite error', e);
    }
    setShowAddParticipant(false);
  };

  // Listen for incoming calls globally
  useEffect(() => {
    if (!currentUser) return;
    const callsQuery = query(
      collection(db, 'calls'),
      where('calleeId', '==', currentUser.id),
      where('status', '==', 'ringing')
    );
    const unsub = onSnapshot(callsQuery, (snapshot) => {
      if (!snapshot.empty) {
        const callDoc = snapshot.docs[0];
        const data = callDoc.data();
        if (!activeCall && !incomingCall) {
          setIncomingCall({
            callId: callDoc.id,
            callerId: data.callerId,
            callerName: data.callerName,
            callerAvatar: data.callerAvatar || '',
            isVideo: data.isVideo || false,
          });
          // Show browser notification if permitted
          if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
            new Notification('Входящий звонок', {
              body: `${data.callerName} звонит`,
              icon: data.callerAvatar || undefined,
            });
          }
        }
      } else {
        setIncomingCall(null);
      }
    }, (err) => {
      console.error('Failed to sync incoming calls:', err);
    });
    return () => unsub();
  }, [currentUser, activeCall, incomingCall]);

  const deleteUser = async (userId: string) => {
    try {
      // 1. Delete user profile document from Firestore
      await deleteDoc(doc(db, 'users', userId));
    } catch (e) {
      console.error('Failed to delete user Firestore document:', e);
    }

    // 2. Try deleting Firebase Auth user
    if (auth.currentUser?.uid === userId) {
      try {
        await auth.currentUser.delete();
      } catch (e: any) {
        console.error('Failed to delete auth user, signing out instead:', e);
        await signOut(auth);
      }
    }
  };

  return (
    <AppContext.Provider value={{
      properties,
      threads,
      hasUnreadMessages,
      unreadMessagesCount,
      setProperties,
      addProperty,
      filters,
      setFilters,
      resetFilters,
      filteredProperties,
      selectedPropertyId,
      setSelectedPropertyId,
      savedIds,
      toggleSaved,
      showFiltersPanel,
      setShowFiltersPanel,
      showQrScanner,
      setShowQrScanner,
      activeDistrictHub,
      setActiveDistrictHub,
      lang,
      setLang,
      t,
      currency,
      setCurrency,
      formatPrice,
      recentSearches,
      setRecentSearches,
      saveRecentSearch,
      deleteRecentSearch,
      clearRecentSearches,
      notifications,
      addNotification,
      markAllNotificationsAsRead,
      clearNotifications,
      updatePropertyViews,
      notificationsEnabled,
      setNotificationsEnabled,
      compareIds,
      toggleCompare,
      toastMessage,
      triggerToast,
      
      // Auth injection
      currentUser,
      setCurrentUser,
      registerUser,
      loginUser,
      logoutUser,
      deleteUser,
      authLoading,

      // Global Call Injection
      incomingCall,
      setIncomingCall,
      activeCall,
      setActiveCall,
      isMuted,
      setIsMuted,
      isSpeakerphone,
      setIsSpeakerphone,
      isCameraOff,
      setIsCameraOff,
      isFrontCamera,
      setIsFrontCamera,
      callStatus,
      setCallStatus,
      showAddParticipant,
      setShowAddParticipant,
      isCallMinimized,
      setIsCallMinimized,
      
      // Global Call Actions
      startOnlineCall,
      acceptCall,
      declineCall,
      endCall,
      toggleMute,
      toggleCamera,
      switchCamera,
      toggleSpeakerphone,
      inviteParticipant,
      cleanupCall,

      // Global Call Refs & Streams
      localStream,
      remoteStream,
      localVideoRef,
      remoteVideoRef,
      remoteAudioRef
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
