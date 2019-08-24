CREATE TABLE players (
  player_id SERIAL,
  player_name VARCHAR(40),
  player_password VARCHAR(40),
  currency SMALLINT DEFAULT 0,
  stability SMALLINT DEFAULT 100,
  average_temperature SMALLINT DEFAULT 20,
  alignment_id SMALLINT DEFAULT 1,
  engineering SMALLINT DEFAULT 0,
  theft SMALLINT DEFAULT 0,
  intrusion SMALLINT DEFAULT 0,
  optics SMALLINT DEFAULT 0,
  sensors SMALLINT DEFAULT 0,
  current_zone_id SMALLINT DEFAULT 1,
  PRIMARY KEY (player_name)
);

CREATE TABLE player_resources (
  player_id SMALLINT,
  resource_id SMALLINT,
  amount SMALLINT
);

CREATE TABLE player_items (
  player_id SMALLINT,
  item_id SMALLINT,
  amount SMALLINT
);

CREATE TABLE player_equipment (
  player_id SMALLINT,
  item_id SMALLINT
);

CREATE TABLE zones (
  zone_id SMALLINT,
  zone_name VARCHAR(40),
  zone_location VARCHAR(40),
  zone_temperature SMALLINT,
  zone_text TEXT,
  zone_type VARCHAR(20),
  zone_em_disturbance SMALLINT,
  zone_namespace TEXT,
  zone_video_url TEXT
);

CREATE TABLE zone_resources (
  zone_id SMALLINT,
  resource_id SMALLINT
);

CREATE TABLE zone_npc (
  zone_id SMALLINT,
  npc_id SMALLINT
);

CREATE TABLE npc (
  npc_id SMALLINT,
  npc_name VARCHAR(40),
  npc_text TEXT,
  currency SMALLINT,
  stability SMALLINT,
  attack_power SMALLINT,
  img_url TEXT
);

CREATE TABLE npc_resources (
  npc_id SMALLINT,
  resource_id SMALLINT,
  amount SMALLINT
);

CREATE TABLE npc_items (
  npc_id SMALLINT,
  item_id SMALLINT,
  amount SMALLINT
);

CREATE TABLE resources (
  resource_id SMALLINT,
  resource_name VARCHAR(50),
  resource_text TEXT,
  img_url TEXT
);

CREATE TABLE items (
  item_id SMALLINT,
  item_name VARCHAR(50),
  item_text TEXT,
  can_equip BOOLEAN,
  equipment_slot_id SMALLINT,
  item_effect_type VARCHAR(30),
  item_effect_modified_stat VARCHAR(30),
  item_effect_impact SMALLINT
);

CREATE TABLE equipment_slots (
  equipment_slot_id SMALLINT,
  equipment_slot_name VARCHAR(15)
);

CREATE TABLE crafting (
  item_id SMALLINT,
  resource_id SMALLINT,
  amount SMALLINT
);

CREATE TABLE alignments (
  alignment_id SMALLINT,
  alignment_name VARCHAR(30)
);
