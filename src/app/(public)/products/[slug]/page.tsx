'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ShoppingCart, Heart, Shield, Truck, RotateCcw, Star } from 'lucide-react';
import { ProductImages } from '@/components/product/ProductImages';
import { ProductVariants } from '@/components/product/ProductVariants';
import { ReviewSection } from '@/components/product/ReviewSection';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Product, ProductVariant } from '@/types';
import { useCartStore } from '@/store/cart.store';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { openCart, setCart } = useCartStore(); // In real app, call addItem API
  
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await api.products.getBySlug(slug as string);
        const prod = (response?.data ?? response) as Product;
        setProduct(prod);
        if (prod.variants && prod.variants.length > 0) {
          setSelectedVariant(prod.variants[0]);
        }
        
        // Fetch related
        const relRes: any = await api.products.getRelated(prod._id);
        const related = relRes?.data?.items ?? relRes?.items ?? relRes?.data ?? relRes;
        setRelated(Array.isArray(related) ? related : []);
      } catch (error) {
        console.error('Failed to load product', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading product...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found.</div>;
  }

  const basePrice = selectedVariant?.price || product.price || product.variants?.[0]?.price || 0;
  const currentSalePrice = selectedVariant?.salePrice || product.salePrice || product.variants?.[0]?.compareAtPrice;
  const currentPrice = basePrice;
  const isOnSale = !!currentSalePrice && currentSalePrice < currentPrice;

  const rawImages = selectedVariant?.images?.length ? selectedVariant.images : product.images || [];
  const images = rawImages.map((img: any) => (typeof img === 'string' ? img : img?.url || 'https://via.placeholder.com/600'));

  const handleAddToCart = async () => {
    if (!product) return;
    const sku = selectedVariant?.sku || product.sku || product.variants?.[0]?.sku;
    if (!sku) {
      console.error('No SKU available for this product');
      return;
    }
    setIsAddingToCart(true);
    try {
      const cartRes: any = await api.cart.addItem({
        sku,
        quantity,
      });
      const updatedCart = cartRes?.data ?? cartRes;
      if (updatedCart) setCart(updatedCart);
      openCart();
    } catch (err) {
      console.error('Failed to add to cart:', err);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-24 lg:pb-8">
      {/* Breadcrumb - Optional */}
      <div className="bg-gray-50 border-b border-border py-3">
        <div className="container text-sm text-text-secondary flex gap-2">
          <a href="/" className="hover:text-primary">Home</a> / 
          <a href="/products" className="hover:text-primary">Products</a> / 
          <span className="text-text-primary">{product.name}</span>
        </div>
      </div>

      <div className="container py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          
          {/* Left Column: Images */}
          <div className="w-full lg:w-1/2">
            <div className="sticky top-24">
              <ProductImages images={images} productName={product.name} />
            </div>
          </div>

          {/* Right Column: Info & Actions */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <h1 className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-2">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 text-sm">
                <Star size={16} className="fill-accent text-accent" />
                <span className="font-medium">{product.averageRating?.toFixed(1) || '0.0'}</span>
                <a href="#reviews" className="text-primary hover:underline">({product.reviewCount || 0} reviews)</a>
              </div>
              <span className="text-text-secondary text-sm px-3 py-1 bg-gray-100 rounded-full">
                SKU: {selectedVariant?.sku || product.sku}
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-8">
              {isOnSale ? (
                <>
                  <span className="text-3xl font-bold text-primary">{formatPrice(currentSalePrice!)}</span>
                  <span className="text-lg text-text-secondary line-through">{formatPrice(currentPrice)}</span>
                  <span className="ml-2 text-sm font-bold text-error bg-red-50 px-2 py-1 rounded">
                    Save {formatPrice(currentPrice - currentSalePrice!)}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-primary">{formatPrice(currentPrice)}</span>
              )}
            </div>

            <p className="text-text-secondary leading-relaxed mb-8">
              {product.shortDescription || product.description}
            </p>

            {/* Variants */}
            <ProductVariants 
              variants={product.variants} 
              selectedVariantId={selectedVariant?._id}
              onSelect={setSelectedVariant}
            />

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="font-semibold text-text-primary mb-3">Quantity:</h3>
              <div className="flex items-center border border-border rounded-md w-max bg-white">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-text-secondary hover:text-primary hover:bg-gray-50"
                >-</button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-text-secondary hover:text-primary hover:bg-gray-50"
                >+</button>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex gap-4 mb-8">
              <Button 
                size="lg" 
                className="flex-1 text-lg shadow-lg" 
                leftIcon={<ShoppingCart size={20} />}
                onClick={handleAddToCart}
                isLoading={isAddingToCart}
              >
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" className="px-6" title="Add to Wishlist">
                <Heart size={20} />
              </Button>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-y border-border py-6 mb-8">
              <div className="flex items-center gap-3">
                <Truck className="text-accent shrink-0" size={24} />
                <span className="text-sm font-medium">Free Delivery Nationwide</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="text-accent shrink-0" size={24} />
                <span className="text-sm font-medium">Up to 5 Years Warranty</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="text-accent shrink-0" size={24} />
                <span className="text-sm font-medium">100 Nights Trial</span>
              </div>
            </div>

          </div>
        </div>

        {/* Full Description & Specs */}
        <div className="mt-16 max-w-4xl">
          <h2 className="text-2xl font-playfair font-bold text-primary mb-6">Product Details</h2>
          <div className="prose prose-green max-w-none text-text-secondary">
            {/* If description contains HTML, we'd use dangerouslySetInnerHTML */}
            <p>{product.description}</p>
          </div>
        </div>

        {/* Reviews Section */}
        <div id="reviews">
          <ReviewSection productId={product._id} />
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-playfair font-bold text-primary mb-8 text-center">You May Also Like</h2>
            <ProductGrid products={related} />
          </div>
        )}
      </div>

      {/* Mobile Sticky Add to Cart Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-border shadow-[0_-4px_10px_rgba(0,0,0,0.1)] z-40 flex gap-3">
        <Button size="lg" variant="outline" className="px-4 shrink-0">
          <Heart size={20} />
        </Button>
        <Button 
          size="lg" 
          className="flex-1"
          onClick={handleAddToCart}
          isLoading={isAddingToCart}
        >
          Add to Cart - {formatPrice((currentSalePrice || currentPrice) * quantity)}
        </Button>
      </div>
    </div>
  );
}
