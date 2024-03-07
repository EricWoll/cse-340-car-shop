-- Data for table `account`

INSERT INTO public.account (
	account_firstname,
	account_lastname,
	account_email,
	account_password
)
VALUES (
	'Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n'
);

UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

DELETE FROM public.account
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';


-- Data for table 'inventory' (GM Hummer)
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer' AND inv_year = '2016';


-- Inner join classification and inventory
SELECT inv_make, inv_model, classification_name
FROM public.classification
	INNER JOIN public.inventory
		ON public.classification.classification_id = public.inventory.classification_id;


-- Update file path to have '/vehicles
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');