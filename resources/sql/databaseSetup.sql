CREATE TABLE players (
  player_id SERIAL,
  player_name VARCHAR(40),
  player_password VARCHAR(40),
  currency SMALLINT,
  stability SMALLINT,
  average_temperature SMALLINT,
  alignment_id SMALLINT,
  engineering SMALLINT,
  theft SMALLINT,
  intrusion SMALLINT,
  optics SMALLINT,
  sensors SMALLINT,
  current_zone_id SMALLINT
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
  zone_em_disturbance SMALLINT
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
  attack_power SMALLINT
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
  resource_text TEXT
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
