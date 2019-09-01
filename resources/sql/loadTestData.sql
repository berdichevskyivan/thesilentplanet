INSERT INTO zones VALUES
(1,'The Overseer','Milky Way Galaxy',20,'Mothership of the Automata. It''s orbiting what''s left of Planet Earth.','Ship',0,'/theoverseer','./resources/video/forest.mp4'),
(2,'Great Amazonian Desert','Planet Earth',60,'What once was the habitat of thousands of species and teaming with life, is now reduced to giant dunes of sand. The lack of atmosphere raises the EM Disturbance to moderate levels.', 'Desert',20,'/greatamazoniandesert','./resources/video/tropical.mp4'),
(3,'Burning Pyramids of Vaktu''an','Planet Vaktu''an',60,'Ancient city inhabited by Enos demons. It is ravaged by rot and fel.', 'City',55,'/pyramidsofvaktuan','./resources/video/vaktuan.mp4'),
(4,'Stardust City','Planet Uruk',60,'Sprawling city located in Gargaron Galaxy. Merchants and soldiers converge and socialize here.', 'City',20,'/stardustcity','./resources/video/stardustcity.mp4'),
(5,'Cliffs of Qurtz','Planet Korin',60,'Calm cliffs where tired machines come to rest.', 'Cliffs',20,'/cliffsofqurtz','./resources/video/qurtz.mp4'),
(6,'Napadozia','Planet Nemk',60,'Water filled zone teaming with life.', 'Desert',20,'/napadozia','./resources/video/napadozia.mp4');

INSERT INTO zone_resources VALUES
(1,1),
(1,2),
(2,1),
(2,5),
(3,6),
(4,7),
(5,8),
(6,9);

INSERT INTO zone_npc VALUES
(1,1),
(1,2),
(2,1),
(2,2),
(3,3),
(4,4),
(5,5),
(6,6);

INSERT INTO npc VALUES
(1,'Doombringer','Doombringer pursue chaos and destruction above all. Their claws can penetrate every known armor.',20,20,2,'./resources/images/npc/doombringer.jpg'),
(2,'Quantum Model XZ','Previous model of Automata created by Humans before their extinction. Now serve as training models.',100,60,5,'./resources/images/npc/quantummodel.jpg'),
(3,'Facemelter','Enos demon known to melt the faces of their enemies. They are fast and cunning beasts.',20,20,2,'./resources/images/npc/facemelter.png'),
(4,'Uruk Blacksmith','Blacksmith of the Uruk tribe. Generally friendly to outsiders.',100,60,5,'./resources/images/npc/urukblacksmith.png'),
(5,'Aruarian Dragon','Interdimensional dragon with metallic scales. The technology used by this being to travel through dimensions is currently unknown.',20,20,2,'./resources/images/npc/aruariandragon.png'),
(6,'Champion of Kmodar','Honorable Champions of the order of Kmodar. They protect the defenseless and are vicious against trespassers.',100,60,5,'./resources/images/npc/championofkmodar.png');

INSERT INTO npc_dialogue(npc_id,dialogue_text) VALUES
(1,'Machines don''t have souls. Or do they?...'),
(1,'Everything ends in chaos.'),
(2,'Is that all you''ve got?'),
(2,'*yawns*'),
(3,'I will melt your face!'),
(4,'Do you need something?'),
(5,'Katmandu will surely find pleasure in ripping every single part of your metallic body...'),
(6,'If you seek justice, I''m your friend. If you seek harming others, this is the last day of your existence.');

INSERT INTO npc_resources VALUES
(1,1,2),
(1,5,2),
(2,1,2),
(2,5,2);

INSERT INTO npc_items VALUES
(1,1,1),
(1,2,1),
(2,1,2),
(2,2,1),
(3,3,2),
(4,4,1),
(4,7,1),
(5,5,2),
(6,6,1);

INSERT INTO resources VALUES
(1,'Platinum Ore','A lump of Platinum Ore. You could extract pure Platinum from it.','./resources/images/resources/platinum_ore.png'),
(2,'Platinum Ingot','An ingot made out of Platinum. It can be used to manufacture specific hardware needed to craft certain items.','./resources/images/resources/platinum_ingot.png'),
(3,'Platinum Circuit Board','Circuit Board based on Platinum. Provides high-speed data transfer between all components of the system, crucial for certain items.','./resources/images/resources/platinum_ore.png'),
(4,'Platinum Gears','Gears made out of Platinum, used in the manufacture of certain items.','./resources/images/resources/platinum_ore.png'),
(5,'Gold Ore','A lump of Gold Ore. You could extract pure Gold from it.','./resources/images/resources/platinum_ore.png'),
(6,'Dark Sulphate Ore','A lump of Dark Sulphate Ore. Used to prepare powerful explosives.','./resources/images/resources/darksulphateore.png'),
(7,'Wood Planks','Wood planks can be used for crafting specific items requiring wood, like swords or axes.','./resources/images/resources/woodplanks.png'),
(8,'Doger Stones','Stones that might be valuable for someone...','./resources/images/resources/dogerstones.png'),
(9,'Nitrate Dust','Nitrate dust used to craft extremely powerful explosives','./resources/images/resources/nitratedust.png');

INSERT INTO items VALUES
(1,'Enos Mask','A Mask carved out of the head of a Enos Demon.','yes',8,'increase','engineering','10',100),
(2,'Basic Repair Kit','Basic Repair Kit used to repair other androids.','no',null,'increase','stability','20',100),
(3,'Utmos, The Black Sword','A massive runed black sword. It seems to be bleeding.','yes',1,'increase,increase','attack_power,max_stability','10,25',100),
(4,'Libram of Fire','Libram sacred to Uruk blasksmiths. Contains the secret to their trade.','no',null,'increase','stability','20',100),
(5,'Interdimensional Staff','Staff used for interdimensional travel. Use with caution.','yes',1,'increase','engineering','10',100),
(6,'Gold Plated Mechatronic Feet','Advanced mechatronic feet used for increased speed and stability.','no',null,'increase','stability','20',100),
(7,'Blueprint: Basic Repair Kit','Used to learn how to craft Basic Repair Kits','no',null,'blueprint',null,null,300),
(8,'Coordinates: Burning Pyramids of Vaktu''an','Used to learn the exact location of the Burning Pyramids of Vaktu''an','no',null,'coordinates',null,3,300);

INSERT INTO equipment_slots VALUES
(1,'Weapon System'),
(2,'CPU Socket'),
(3,'Storage Unit'),
(4,'Cooling System'),
(5,'Power Supply Unit'),
(6,'Actuators'),
(7,'Sensors'),
(8,'Optics');

INSERT INTO blueprints VALUES
(7,2,1,1),
(7,2,9,2);

INSERT INTO alignments VALUES
(1,'Neutral'),
(2,'Lawful Neutral'),
(3,'Chaotic Neutral');
