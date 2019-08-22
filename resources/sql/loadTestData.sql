INSERT INTO players VALUES
(1,'akitsushima','12345',0,100,20,1,0,0,0,0,0,1);

INSERT INTO player_resources VALUES
(1,1,10),
(1,2,15);

INSERT INTO player_items VALUES
(1,1,2),
(1,2,1);

INSERT INTO player_equipment VALUES
(1,1);

INSERT INTO zones VALUES
(1,'The Overseer','Milky Way Galaxy',20,'Mothership of the Automata. It''s orbiting what''s left of Planet Earth.','Ship',0),
(2,'Great Amazonian Desert','Planet Earth',60,'What once was the habitat of thousands of species and teaming with life, is now reduced to giant dunes of sand. The lack of atmosphere raises the EM Disturbance to moderate levels.', 'Desert',20);

INSERT INTO zone_resources VALUES
(1,1),
(1,2),
(2,1),
(2,5);

INSERT INTO zone_npc VALUES
(1,1),
(1,2),
(2,1),
(2,2);

INSERT INTO npc VALUES
(1,'Doombringer','Doombringer pursue chaos and destruction above all. Their claws can penetrate every known armor.',20,20,2,'./resources/images/npc/doombringer.jpg'),
(2,'Quantum Model XZ','Previous model of Automata created by Humans before their extinction. Now serve as training models.',100,60,5,'./resources/images/npc/quantummodel.jpg');

INSERT INTO npc_resources VALUES
(1,1,2),
(1,5,2),
(2,1,2),
(2,5,2);

INSERT INTO npc_items VALUES
(1,1,1),
(1,2,1),
(2,1,2),
(2,2,1);

INSERT INTO resources VALUES
(1,'Platinum Ore','A lump of Platinum Ore. You could extract pure Platinum from it.','./resources/images/resources/platinum_ore.png'),
(2,'Platinum Ingot','An ingot made out of Platinum. It can be used to manufacture specific hardware needed to craft certain items.','./resources/images/resources/platinum_ingot.png'),
(3,'Platinum Circuit Board','Circuit Board based on Platinum. Provides high-speed data transfer between all components of the system, crucial for certain items.','./resources/images/resources/platinum_ore.png'),
(4,'Platinum Gears','Gears made out of Platinum, used in the manufacture of certain items.','./resources/images/resources/platinum_ore.png'),
(5,'Gold Ore','A lump of Gold Ore. You could extract pure Gold from it.','./resources/images/resources/platinum_ore.png');

INSERT INTO items VALUES
(1,'Enos Mask','A Mask carved out of the head of a Enos Demon.','yes',1,'increase','engineering',10),
(2,'Basic Repair Kit','Basic Repair Kit used to repair other androids.','no',null,'increase','stability',20);

INSERT INTO equipment_slots VALUES
(1,'Head'),
(2, 'Optics'),
(3, 'Sensors'),
(4, 'Chest'),
(5, 'Legs'),
(6, 'Hands'),
(7, 'Back');

INSERT INTO crafting VALUES
(1,3,1),
(1,4,1);

INSERT INTO alignments VALUES
(1,'Neutral'),
(2,'Lawful Neutral'),
(3,'Chaotic Neutral');
