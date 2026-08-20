-- TASK 013A — seed current local catalog + owned curricula
-- Safe to rerun: INSERT ... ON CONFLICT updates in place (no duplicate rows).
-- Do not hardcode UUIDs. Programs are keyed by slug; sections/lessons resolve
-- program_id / section_id with joins.
--
-- LOCAL → DB MAPPING
-- Canonical program slugs (must match user_programs.program_slug):
--   21-dni-do-manj-anksioznosti
--   21-dni-do-boljse-samozavesti
--   najdi-sebe
--   samohipnoza-v-praksi
--   boljsi-spanec-boljse-jutri
--   umiri-telo-umiri-um
--   zasij-v-21-dneh
--   21-dni-hvaleznosti
--
-- Copy sources:
--   programs: lib/content/catalog.ts + dashboard.ts labels + program-detail.ts
--   sections/lessons: lib/content/owned-program.ts visible curriculum only
--
-- Owned programs with full curriculum:
--   21-dni-do-manj-anksioznosti   3 sections, 21 lessons
--   21-dni-do-boljse-samozavesti  3 sections, 10 visible lessons
--   najdi-sebe                    3 sections, 21 lessons
--   samohipnoza-v-praksi          2 sections, 8 lessons
--
-- Catalog-only (program row only; no fabricated lessons):
--   boljsi-spanec-boljse-jutri
--   umiri-telo-umiri-um
--   zasij-v-21-dneh
--   21-dni-hvaleznosti
--
-- Confidence extra TS lessons dan-11 .. dan-21 are NOT seeded.
-- They exist in owned-program.ts but are excluded from sections
-- ("še ni viden v vsebini programa").
--
-- lesson_count:
--   owned programs = visible owned lesson count (not catalog marketing 12/9)
--   catalog-only   = catalog.ts lessons value (no lesson rows yet)
--
-- Media URLs stay null. No uploads in TASK 013A.
-- Pages must keep reading local TypeScript after this seed.

-- ---------------------------------------------------------------------------
-- 1) Programs
-- ---------------------------------------------------------------------------
insert into public.programs (
  slug,
  title,
  subtitle,
  short_description,
  long_description,
  category,
  category_label,
  price_cents,
  currency,
  duration_label,
  difficulty,
  lesson_count,
  is_published,
  is_featured,
  sort_order,
  cover_image_url
)
values
  (
    '21-dni-do-manj-anksioznosti',
    '21 DNI DO MANJ ANKSIOZNOSTI',
    '21 dni do manj anksioznosti',
    'Program za pomiritev uma, zmanjšanje stresa in več notranjega miru.',
    'Program za pomiritev uma, zmanjšanje stresa in več notranjega miru. S premišljenimi vajami in vodenimi lekcijami te program vodi korak za korakom.',
    'anxiety',
    'Anksioznost',
    8900,
    'EUR',
    '21 dni',
    'Vseh stopenj',
    21,
    true,
    false,
    1,
    null
  ),
  (
    '21-dni-do-boljse-samozavesti',
    '21 DNI DO BOLJŠE SAMOZAVESTI',
    '21 dni do boljše samozavesti',
    'Okrepi svojo samozavest in zgradi notranjo moč, ki te vodi naprej.',
    'Ta 21-dnevni program ti pomaga premagati dvome, okrepiti samozavest in občutek lastne vrednosti. Z vsakodnevno prakso in vodenimi vajami boš stopil/a v svojo najbolj avtentično različico sebe.',
    'confidence',
    'Samozavest',
    8900,
    'EUR',
    '21 dni',
    'Vseh stopenj',
    10,
    true,
    false,
    2,
    null
  ),
  (
    'najdi-sebe',
    'NAJDI SEBE',
    'Najdi sebe',
    'Potovanje vase. Odkrij, kdo si, česa si želiš in kam želiš iti.',
    'Potovanje vase. Odkrij, kdo si, česa si želiš in kam želiš iti. S premišljenimi vajami in vodenimi lekcijami te program vodi korak za korakom.',
    'growth',
    'Osebna rast',
    7900,
    'EUR',
    '21 dni',
    'Vseh stopenj',
    21,
    true,
    false,
    3,
    null
  ),
  (
    'samohipnoza-v-praksi',
    'SAMOHIPNOZA V PRAKSI',
    'Samohipnoza v praksi',
    'Nauči se samohipnoze in jo uporabi kadarkoli jo potrebuješ.',
    'Nauči se samohipnoze in jo uporabi kadarkoli jo potrebuješ. S premišljenimi vajami in vodenimi lekcijami te program vodi korak za korakom.',
    'self-hypnosis',
    'Samohipnoza',
    6900,
    'EUR',
    'Lifetime',
    'Vseh stopenj',
    8,
    true,
    false,
    4,
    null
  ),
  (
    'boljsi-spanec-boljse-jutri',
    'BOLJŠI SPANEC, BOLJŠE JUTRI',
    null,
    'Nežen program za globlji spanec, umirjene večere in boljša jutra.',
    'Nežen program za globlji spanec, umirjene večere in boljša jutra. S premišljenimi vajami in vodenimi lekcijami te program vodi korak za korakom.',
    'sleep',
    'Spanec',
    6900,
    'EUR',
    '21 dni',
    'Vseh stopenj',
    8,
    true,
    false,
    5,
    null
  ),
  (
    'umiri-telo-umiri-um',
    'UMIRI TELO, UMIRI UM',
    null,
    'Sprostitev telesa in uma s hipnozo, dihom in nežnimi vodenimi vajami.',
    'Sprostitev telesa in uma s hipnozo, dihom in nežnimi vodenimi vajami. S premišljenimi vajami in vodenimi lekcijami te program vodi korak za korakom.',
    'relaxation',
    'Sprostitev',
    5900,
    'EUR',
    '14 dni',
    'Vseh stopenj',
    7,
    true,
    false,
    6,
    null
  ),
  (
    'zasij-v-21-dneh',
    'ZASIJ V 21 DNEH',
    null,
    '21-dnevna pot do več svetlobe, jasnosti in notranje moči.',
    '21-dnevna pot do več svetlobe, jasnosti in notranje moči. S premišljenimi vajami in vodenimi lekcijami te program vodi korak za korakom.',
    'growth',
    'Osebna rast',
    8900,
    'EUR',
    '21 dni',
    'Vseh stopenj',
    11,
    true,
    false,
    7,
    null
  ),
  (
    '21-dni-hvaleznosti',
    '21 DNI HVALEŽNOSTI',
    null,
    'Dnevnik hvaležnosti, ki krepi mir, prisotnost in toplejši pogled na življenje.',
    'Dnevnik hvaležnosti, ki krepi mir, prisotnost in toplejši pogled na življenje. S premišljenimi vajami in vodenimi lekcijami te program vodi korak za korakom.',
    'journal',
    'Dnevnik',
    5900,
    'EUR',
    '21 dni',
    'Vseh stopenj',
    7,
    true,
    false,
    8,
    null
  )
on conflict (slug) do update
set
  title = excluded.title,
  subtitle = excluded.subtitle,
  short_description = excluded.short_description,
  long_description = excluded.long_description,
  category = excluded.category,
  category_label = excluded.category_label,
  price_cents = excluded.price_cents,
  currency = excluded.currency,
  duration_label = excluded.duration_label,
  difficulty = excluded.difficulty,
  lesson_count = excluded.lesson_count,
  is_published = excluded.is_published,
  is_featured = excluded.is_featured,
  sort_order = excluded.sort_order,
  cover_image_url = excluded.cover_image_url,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- 2) Sections (owned programs only)
-- ---------------------------------------------------------------------------
insert into public.program_sections (
  program_id,
  title,
  description,
  section_order
)
select
  p.id,
  s.title,
  s.description,
  s.section_order
from (
  values
    ('21-dni-do-manj-anksioznosti', '1. TEDEN – RAZUMEVANJE ANKSIOZNOSTI', null::text, 1),
    ('21-dni-do-manj-anksioznosti', '2. TEDEN – UMIRJANJE TELESA IN UMA', null, 2),
    ('21-dni-do-manj-anksioznosti', '3. TEDEN – NOVA NOTRANJA STABILNOST', null, 3),
    ('21-dni-do-boljse-samozavesti', '1. TEDEN – SPOZNAJ SEBE', null, 1),
    ('21-dni-do-boljse-samozavesti', '2. TEDEN – OKREPI SAMOZAVEST', null, 2),
    ('21-dni-do-boljse-samozavesti', '3. TEDEN – ŽIVI SVOJO MOČ', null, 3),
    ('najdi-sebe', '1. TEDEN – SPOZNAJ SEBE', null, 1),
    ('najdi-sebe', '2. TEDEN – ODLOŽI, KAR NI TVOJE', null, 2),
    ('najdi-sebe', '3. TEDEN – USTVARI SVOJO SMER', null, 3),
    ('samohipnoza-v-praksi', '1. DEL – OSNOVE', null, 1),
    ('samohipnoza-v-praksi', '2. DEL – PRAKSA', null, 2)
) as s(program_slug, title, description, section_order)
join public.programs p on p.slug = s.program_slug
on conflict (program_id, section_order) do update
set
  title = excluded.title,
  description = excluded.description,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- 3) Lessons (owned visible curriculum; slugs match runtime lesson slugs)
-- duration_minutes follows owned-program.ts durationForDay: 13, 15, 14, 16, 12
-- is_preview: first 5 lessons, matching public program-detail previewCount
-- ---------------------------------------------------------------------------
insert into public.lessons (
  program_id,
  section_id,
  slug,
  title,
  description,
  lesson_order,
  duration_minutes,
  content_type,
  is_preview,
  is_published,
  unlock_mode
)
select
  p.id,
  ps.id,
  l.slug,
  l.title,
  l.description,
  l.lesson_order,
  l.duration_minutes,
  l.content_type,
  l.is_preview,
  true,
  'sequential'
from (
  values
    -- 21-dni-do-manj-anksioznosti
    ('21-dni-do-manj-anksioznosti', 1, 'kaj-je-anksioznost', 'Kaj je anksioznost?', 'Danes spoznaš anksioznost brez sramu. Ni napaka – je signal, ki ga lahko začneš razumeti.', 1, 13, 'video', true),
    ('21-dni-do-manj-anksioznosti', 1, 'kako-telo-obcuti-anksioznost', 'Kako telo občuti anksioznost', 'Anksioznost se najprej pogosto pokaže v telesu. Danes opazuješ napetost, dih in ritem, ne da bi se jima uprl/a.', 2, 15, 'video', true),
    ('21-dni-do-manj-anksioznosti', 1, 'misli-in-custva', 'Misli in čustva', 'Misli in čustva se hranijo med seboj. Danes se naučiš ju ločiti dovolj, da dobiš prostor za izbiro.', 3, 14, 'video', true),
    ('21-dni-do-manj-anksioznosti', 1, 'tisina-med-mislimi', 'Tišina med mislimi', 'Med eno mislijo in naslednjo je kratek prostor. Danes vadiš, da ga opaziš – in da v njem malo dlje ostaneš.', 4, 16, 'video', true),
    ('21-dni-do-manj-anksioznosti', 1, 'izogibanje-ali-soocenje', 'Izogibanje ali soočenje', 'Izogibanje za hip pomiri, a dolgoročno krepi strah. Danes narediš majhen korak proti soočenju.', 5, 12, 'video', true),
    ('21-dni-do-manj-anksioznosti', 1, 'majhen-korak-naprej', 'Majhen korak naprej', 'Spremembe ne pridejo naenkrat. Danes izbereš en majhen, izvedljiv korak, ki telo prepriča, da si varen/a.', 6, 13, 'video', false),
    ('21-dni-do-manj-anksioznosti', 1, 'zakljucek-prvega-tedna', 'Zaključek prvega tedna', 'Prvi teden zaključiš z razumevanjem, ne s pritiskom. Pogledaš, kaj si opazil/a – in to šteje.', 7, 15, 'video', false),
    ('21-dni-do-manj-anksioznosti', 2, 'tvoj-notranji-alarm', 'Tvoj notranji alarm', 'Notranji alarm te želi zaščititi, tudi ko nevarnosti ni. Danes ga spoznaš od blizu, da te ne vodi več sam.', 8, 14, 'video', false),
    ('21-dni-do-manj-anksioznosti', 2, 'dih-in-zivcni-sistem', 'Dih in živčni sistem', 'Dih je najbližji stik z živčnim sistemom. Danes vadiš ritem, ki telesu sporoča: zdaj sem varen/a.', 9, 16, 'video', false),
    ('21-dni-do-manj-anksioznosti', 2, 'ustvarjanje-obcutka-varnosti', 'Ustvarjanje občutka varnosti', 'Varnost ni samo zunanja. Danes gradiš notranji občutek opore, ki ga lahko prikličeš, ko ga potrebuješ.', 10, 12, 'video', false),
    ('21-dni-do-manj-anksioznosti', 2, 'prepoznavanje-sprozilcev', 'Prepoznavanje sprožilcev', 'Sprožilci niso sovražniki. Ko jih prepoznaš, dobiš izbiro, preden te odziv ponese s seboj.', 11, 13, 'video', false),
    ('21-dni-do-manj-anksioznosti', 2, 'vrnitev-v-sedanji-trenutek', 'Vrnitev v sedanji trenutek', 'Anksioznost pogosto živi v prihodnosti. Danes se vračaš v telo, dih in tisto, kar je res zdaj.', 12, 15, 'video', false),
    ('21-dni-do-manj-anksioznosti', 2, 'umirjanje-notranjega-dialoga', 'Umirjanje notranjega dialoga', 'Notranji glas zna pretiravati. Danes ga slišiš, ga upočasniš in mu ponudiš bolj resničen ton.', 13, 14, 'video', false),
    ('21-dni-do-manj-anksioznosti', 2, 'tvoj-novi-odziv', 'Tvoj novi odziv', 'Drugi teden zaključiš z novim odzivom: opaziš alarm, se umiriš in izbereš naslednji korak.', 14, 16, 'video', false),
    ('21-dni-do-manj-anksioznosti', 3, 'zaupanje-telesu', 'Zaupanje telesu', 'Telo ni proti tebi. Danes vadiš zaupanje v njegove signale – kot zaveznika, ne kot grožnjo.', 15, 12, 'video', false),
    ('21-dni-do-manj-anksioznosti', 3, 'ko-pride-napetost', 'Ko pride napetost', 'Napetost se bo še vrnila. Danes vadiš, kaj narediš takrat – mirno, konkretno in brez obtoževanja.', 16, 13, 'video', false),
    ('21-dni-do-manj-anksioznosti', 3, 'soocenje-z-negotovostjo', 'Soočenje z negotovostjo', 'Negotovosti ni treba odpraviti, da bi živel/a. Danes vadiš, da jo nosiš, ne da te ustavi.', 17, 15, 'video', false),
    ('21-dni-do-manj-anksioznosti', 3, 'gradnja-notranje-varnosti', 'Gradnja notranje varnosti', 'Notranja varnost se gradi s ponavljanjem. Danes utrdiš prakso, ki ti ostane tudi po programu.', 18, 14, 'video', false),
    ('21-dni-do-manj-anksioznosti', 3, 'zivljenje-z-vec-miru', 'Življenje z več miru', 'Mir ni praznina. Danes ga vnašaš v vsakdan – v odnose, ritem in odločitve, ki so tvoje.', 19, 16, 'video', false),
    ('21-dni-do-manj-anksioznosti', 3, 'tvoja-nova-notranja-drza', 'Tvoja nova notranja drža', 'Nova drža ni maska. Je bolj miren, jasen način, kako stojiš pri sebi, ko pride val.', 20, 12, 'video', false),
    ('21-dni-do-manj-anksioznosti', 3, 'zakljucek-programa', 'Zaključek programa', 'Zaključek je opomnik, da orodja ostanejo s tabo. Danes prepoznaš, kaj že znaš – in to vzameš naprej.', 21, 13, 'video', false),

    -- 21-dni-do-boljse-samozavesti (visible owned curriculum only)
    ('21-dni-do-boljse-samozavesti', 1, 'spoznaj-svojo-vrednost', 'Spoznaj svojo vrednost', 'Danes se ustavi pri tem, kdo si – brez primerjav in brez pogojev. Tvoja vrednost ni nekaj, kar moraš dokazati.', 1, 13, 'video', true),
    ('21-dni-do-boljse-samozavesti', 1, 'premagaj-dvome', 'Premagaj dvome', 'Dvomi se lahko umirijo, ko jih pogledaš od blizu. Danes se naučiš, kako jih slišiš, ne da bi jim predal krmilo.', 2, 15, 'video', true),
    ('21-dni-do-boljse-samozavesti', 1, 'zgradi-notranjo-moc', 'Zgradi notranjo moč', 'Notranja moč ni nekaj, s čimer se rodiš. Je nekaj, kar vsak dan gradiš – skozi svoje misli, odločitve in dejanja. Danes boš naredil/a korak k sebi.', 3, 14, 'video', true),
    ('21-dni-do-boljse-samozavesti', 1, 'samozavest-v-dejanjih', 'Samozavest v dejanjih', 'Samozavest zraste, ko jo živiš. Danes narediš majhen, konkreten korak, ki potrdi tvojo notranjo držo.', 4, 16, 'video', true),
    ('21-dni-do-boljse-samozavesti', 1, 'govori-s-seboj-z-ljubeznijo', 'Govori s seboj z ljubeznijo', 'Notranji glas te lahko podpira ali te taji. Danes vadimo govor, ki je jasen, topel in resničen.', 5, 12, 'video', true),
    ('21-dni-do-boljse-samozavesti', 2, 'postavi-zdrave-meje', 'Postavi zdrave meje', 'Meje niso zid. So način, kako varuješ svojo energijo in ostajaš zvest/a sebi.', 6, 13, 'video', false),
    ('21-dni-do-boljse-samozavesti', 2, 'sprejmi-in-bodi-hvalezen', 'Sprejmi in bodi hvaležen/a', 'Hvaležnost ne izniči tistega, kar je težko. Pomaga ti videti, kaj že drži tvoj dan.', 7, 15, 'video', false),
    ('21-dni-do-boljse-samozavesti', 3, 'vizualizacija-tvoje-prihodnosti', 'Vizualizacija tvoje prihodnosti', 'Danes si dovoliš jasno sliko prihodnosti, v kateri stojiš v svoji moči – mirno in samozavestno.', 8, 14, 'video', false),
    ('21-dni-do-boljse-samozavesti', 3, 'premagaj-strah-pred-neuspehom', 'Premagaj strah pred neuspehom', 'Strah pred napako te lahko ustavi še pred prvim korakom. Danes ga pogledaš in greš mimo njega.', 9, 16, 'video', false),
    ('21-dni-do-boljse-samozavesti', 3, 'praznuj-sebe', 'Praznuj sebe', 'Zaključek ni konec. Je trenutek, ko prepoznaš, koliko si že naredil/a – in to proslaviš.', 10, 12, 'video', false),

    -- najdi-sebe
    ('najdi-sebe', 1, 'kdo-sem-danes', 'Kdo sem danes?', 'Danes se ustaviš pri sebi, kakršen/a si zdaj – brez zgodbe o tem, kdo bi moral/a biti.', 1, 13, 'video', true),
    ('najdi-sebe', 1, 'kaj-mi-daje-energijo', 'Kaj mi daje energijo?', 'Slediš tistemu, kar te napolni. Danes prepoznaš vire, ki ti vračajo moč.', 2, 15, 'video', true),
    ('najdi-sebe', 1, 'kaj-mi-jemlje-energijo', 'Kaj mi jemlje energijo?', 'Nekatere vloge in navade te tiho praznijo. Danes jih poimenuješ, da jih lahko kasneje odložiš.', 3, 14, 'video', true),
    ('najdi-sebe', 1, 'kaj-si-v-resnici-zelim', 'Kaj si v resnici želim?', 'Pod pričakovanji je tvoja želja. Danes jo slišiš dovolj jasno, da ji daš prostor – brez opravičevanja.', 4, 16, 'video', true),
    ('najdi-sebe', 1, 'moje-vrednote', 'Moje vrednote', 'Vrednote so kompas, ko je okoli tebe hrup. Danes izbereš tiste, ki so res tvoje.', 5, 12, 'video', true),
    ('najdi-sebe', 1, 'kaj-me-zadrzuje', 'Kaj me zadržuje?', 'Zadržki niso lenoba. Danes pogledaš strah, navado ali dolžnost, ki te drži na mestu.', 6, 13, 'video', false),
    ('najdi-sebe', 1, 'kaj-sem-odkril-o-sebi', 'Kaj sem odkril/a o sebi?', 'Prvi teden zaključiš z jasnostjo. Zbereš, kaj si videl/a – in to vzameš v naslednji teden.', 7, 15, 'video', false),
    ('najdi-sebe', 2, 'pricakovanja-drugih', 'Pričakovanja drugih', 'Pričakovanja drugih lahko zvenijo kot tvoj glas. Danes ločiš, kaj je tvoje in kaj si prevzel/a.', 8, 14, 'video', false),
    ('najdi-sebe', 2, 'vloge-ki-jih-igram', 'Vloge, ki jih igram', 'Vloge so včasih koristne, včasih utesnjene. Danes vidiš, kje igraš vlogo namesto sebe.', 9, 16, 'video', false),
    ('najdi-sebe', 2, 'strah-pred-spremembo', 'Strah pred spremembo', 'Strah pred spremembo varuje znano. Danes ga slišiš in vseeno narediš prostor za premik.', 10, 12, 'video', false),
    ('najdi-sebe', 2, 'dovoljenje-da-sem-jaz', 'Dovoljenje, da sem jaz', 'Nihče ti ne more dati dovoljenja namesto tebe. Danes ga daš sebi – mirno in odločno.', 11, 13, 'video', false),
    ('najdi-sebe', 2, 'poslusanje-svoje-intuicije', 'Poslušanje svoje intuicije', 'Intuicija je tiha, a vztrajna. Danes vadiš, da jo slišiš pred razlago, ki jo utiša.', 12, 15, 'video', false),
    ('najdi-sebe', 2, 'postavljanje-meja', 'Postavljanje meja', 'Meje varujejo tvoje središče. Danes postaviš eno jasno mejo, ki te vrača k sebi.', 13, 14, 'video', false),
    ('najdi-sebe', 2, 'vrnitev-k-sebi', 'Vrnitev k sebi', 'Drugi teden zaključiš z vrnitvijo. Odložiš, kar ni tvoje, in se spet postaviš v svoje središče.', 14, 16, 'video', false),
    ('najdi-sebe', 3, 'kako-zelim-ziveti', 'Kako želim živeti?', 'Danes ne iščeš popolnega načrta. Iščeš občutek življenja, ki ti pristaja – in ga poimenuješ.', 15, 12, 'video', false),
    ('najdi-sebe', 3, 'moja-notranja-vizija', 'Moja notranja vizija', 'Vizija ni pritisk. Je topla slika smeri, v kateri dihaš lažje in stojiš bolj pri sebi.', 16, 13, 'video', false),
    ('najdi-sebe', 3, 'kaj-izbiram-zase', 'Kaj izbiram zase?', 'Smer nastane z izbiro. Danes izbereš eno stvar zase – zavestno, brez opravičila.', 17, 15, 'video', false),
    ('najdi-sebe', 3, 'prvi-konkretni-koraki', 'Prvi konkretni koraki', 'Vizija potrebuje korak. Danes ga narediš dovolj majhnega, da ga zmoreš ponoviti.', 18, 14, 'video', false),
    ('najdi-sebe', 3, 'zaupanje-vase', 'Zaupanje vase', 'Zaupanje raste, ko držiš besedo sebi. Danes utrdiš ta občutek z eno zanesljivo gesto.', 19, 16, 'video', false),
    ('najdi-sebe', 3, 'moja-nova-smer', 'Moja nova smer', 'Nova smer ni beg. Je odločitev, da greš naprej kot ti – z več jasnosti in manj prilagajanja.', 20, 12, 'video', false),
    ('najdi-sebe', 3, 'nadaljujem-kot-jaz', 'Nadaljujem kot jaz', 'Zaključek ni nova identiteta. Je zaveza, da nadaljuješ kot ti – v ritmu, ki je tvoj.', 21, 13, 'video', false),

    -- samohipnoza-v-praksi
    ('samohipnoza-v-praksi', 1, 'kaj-je-samohipnoza', 'Kaj je samohipnoza?', 'Samohipnoza ni izguba nadzora. Je osredotočeno, sproščeno stanje, ki ga lahko vodiš sam/a.', 1, 13, 'video', true),
    ('samohipnoza-v-praksi', 1, 'kako-vstopiti-v-sprosceno-stanje', 'Kako vstopiti v sproščeno stanje', 'Danes vadiš vstop: dih, pozornost in dovoljenje, da se telo umiri dovolj za delo.', 2, 15, 'video', true),
    ('samohipnoza-v-praksi', 1, 'ustvarjanje-notranjega-fokusa', 'Ustvarjanje notranjega fokusa', 'Fokus drži prakso. Danes se naučiš zbrati pozornost, ne da bi se silil/a.', 3, 14, 'video', true),
    ('samohipnoza-v-praksi', 1, 'sugestije-ki-delujejo', 'Sugestije, ki delujejo', 'Dobre sugestije so preproste, resnične in v sedanjiku. Danes sestaviš take, ki jih telo lahko sprejme.', 4, 16, 'video', true),
    ('samohipnoza-v-praksi', 2, 'sidranje-obcutkov', 'Sidranje občutkov', 'Občutek, ki ga hočeš ponoviti, potrebuje sidro. Danes ga povežeš z gesto, ki jo lahko prikličeš.', 5, 12, 'video', true),
    ('samohipnoza-v-praksi', 2, 'samohipnoza-za-mir', 'Samohipnoza za mir', 'Prakso usmeriš v mir. Danes vstopiš, se umiriš in pustiš, da se živčni sistem spomni varnosti.', 6, 13, 'video', false),
    ('samohipnoza-v-praksi', 2, 'samohipnoza-za-samozavest', 'Samohipnoza za samozavest', 'Isto orodje lahko nosi drug namen. Danes vadiš sugestije, ki krepijo notranjo držo.', 7, 15, 'video', false),
    ('samohipnoza-v-praksi', 2, 'tvoja-osebna-praksa', 'Tvoja osebna praksa', 'Zaključek je tvoj ritual. Danes zložiš korake v prakso, ki jo lahko ponoviš, kadar jo potrebuješ.', 8, 14, 'video', false)
) as l(
  program_slug,
  section_order,
  slug,
  title,
  description,
  lesson_order,
  duration_minutes,
  content_type,
  is_preview
)
join public.programs p on p.slug = l.program_slug
join public.program_sections ps
  on ps.program_id = p.id
 and ps.section_order = l.section_order
on conflict (program_id, slug) do update
set
  section_id = excluded.section_id,
  title = excluded.title,
  description = excluded.description,
  lesson_order = excluded.lesson_order,
  duration_minutes = excluded.duration_minutes,
  content_type = excluded.content_type,
  is_preview = excluded.is_preview,
  is_published = excluded.is_published,
  unlock_mode = excluded.unlock_mode,
  updated_at = now();
