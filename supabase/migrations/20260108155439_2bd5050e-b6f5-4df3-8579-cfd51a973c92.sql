-- Create properties table
CREATE TABLE public.properties (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    price TEXT NOT NULL,
    location TEXT NOT NULL,
    colony TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'House',
    area TEXT NOT NULL,
    beds INTEGER DEFAULT 0,
    baths INTEGER DEFAULT 0,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'Available',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create leads table
CREATE TABLE public.leads (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    buyer_name TEXT NOT NULL,
    buyer_phone TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Properties: Public read access for everyone
CREATE POLICY "Properties are viewable by everyone" 
ON public.properties 
FOR SELECT 
USING (true);

-- Properties: Only authenticated users (admins) can insert/update/delete
CREATE POLICY "Authenticated users can insert properties" 
ON public.properties 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update properties" 
ON public.properties 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete properties" 
ON public.properties 
FOR DELETE 
TO authenticated
USING (true);

-- Leads: Anyone can create a lead (public form submission)
CREATE POLICY "Anyone can create leads" 
ON public.leads 
FOR INSERT 
WITH CHECK (true);

-- Leads: Only authenticated users can view leads
CREATE POLICY "Authenticated users can view leads" 
ON public.leads 
FOR SELECT 
TO authenticated
USING (true);

-- Leads: Only authenticated users can update leads
CREATE POLICY "Authenticated users can update leads" 
ON public.leads 
FOR UPDATE 
TO authenticated
USING (true);

-- Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', true);

-- Storage policies for property images
CREATE POLICY "Property images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can upload property images" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can update property images" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can delete property images" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'property-images');