select es.equipment_slot_id,
es.equipment_slot_name,
items.item_id,
items.item_name,
items.item_text,
items.item_effect_type,
items.item_effect_modified_stat,
items.item_effect_impact
from equipment_slots es
left outer join items on es.equipment_slot_id=items.equipment_slot_id
and items.item_id in (select item_id from player_equipment where player_id=1);
