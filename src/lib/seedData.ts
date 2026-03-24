import { supabase } from './supabase';

export const seedInitialData = async () => {
  try {
    // Check if products already exist
    const { data: existingProducts } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    if (existingProducts && existingProducts.length > 0) {
      console.log('Database already has products, skipping seed');
      return;
    }

    // Insert sample products
    const sampleProducts = [
      {
        name: 'Notebook Gamer Pro',
        description: 'Notebook de alta performance com processador Intel i7 e RTX 3060',
        price: 4599.99,
        stock_quantity: 5,
        image_url:
          'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
      },
      {
        name: 'Smartphone XL Max',
        description: 'Tela AMOLED 6.7" com câmera 108MP e bateria de 5000mAh',
        price: 2899.99,
        stock_quantity: 12,
        image_url:
          'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
      },
      {
        name: 'Fone Bluetooth Premium',
        description: 'Fone com cancelamento de ruído ativo e 40h de bateria',
        price: 899.99,
        stock_quantity: 25,
        image_url:
          'https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg?auto=compress&cs=tinysrgb&w=400',
      },
      {
        name: 'Smartwatch Fitness',
        description: 'Relógio inteligente com monitor cardíaco e GPS integrado',
        price: 599.99,
        stock_quantity: 18,
        image_url:
          'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=400',
      },
      {
        name: 'Tablet Productivity',
        description: 'Tablet 10.5" com processador Snapdragon 888 e 8GB RAM',
        price: 1899.99,
        stock_quantity: 8,
        image_url:
          'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=400',
      },
      {
        name: 'Câmera Digital Mirrorless',
        description: 'Câmera 24MP com lente 18-55mm e gravação em 4K 60fps',
        price: 3599.99,
        stock_quantity: 3,
        image_url:
          'https://images.pexels.com/photos/606933/pexels-photo-606933.jpeg?auto=compress&cs=tinysrgb&w=400',
      },
    ];

    const { error } = await supabase.from('products').insert(sampleProducts);

    if (error) {
      console.error('Error seeding products:', error);
    } else {
      console.log('Sample products created successfully');
    }
  } catch (error) {
    console.error('Seed error:', error);
  }
};
