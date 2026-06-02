import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  ShoppingCart, Trash2, BookOpen, CreditCard,
  Tag, ArrowRight, ChevronRight, Lock, Shield, CheckCircle
} from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, clearCart, total } = useCart();
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);

  const discount = couponApplied ? total * 0.15 : 0;
  const finalTotal = total - discount;

  const handleCoupon = () => {
    if (coupon.toUpperCase() === 'ACADPRO15') {
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Cupón inválido o expirado.');
      setCouponApplied(false);
    }
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    await new Promise((r) => setTimeout(r, 1500));
    setCheckingOut(false);
    alert('¡Compra exitosa! (demo)');
    clearCart();
  };

  if (cart.length === 0) {
    return (
      <div className="page-wrapper flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/8 flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-10 h-10 text-slate-600" />
          </div>
          <h1 className="font-display font-bold text-2xl text-white mb-3">Tu carrito está vacío</h1>
          <p className="text-slate-400 mb-8 max-w-xs mx-auto">Explora nuestro catálogo y encuentra el curso perfecto para ti.</p>
          <Link to="/courses" className="btn-gradient px-8 py-3.5 rounded-2xl text-white font-semibold inline-flex items-center gap-2">
            Explorar cursos <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container-xl py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-white mb-1">Mi Carrito</h1>
          <p className="text-slate-400 text-sm">{cart.length} {cart.length === 1 ? 'curso' : 'cursos'} seleccionados</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Cart items */}
          <div className="flex-1 space-y-4">
            {cart.map((course) => (
              <div key={course._id} className="glass-card rounded-2xl p-5 flex gap-5 items-start">
                {/* Thumbnail */}
                <Link to={`/courses/${course._id}`}>
                  <div className={`w-24 h-16 rounded-xl bg-gradient-to-br ${course.color || 'from-indigo-900 to-purple-900'} flex items-center justify-center flex-shrink-0`}>
                    <BookOpen className="w-6 h-6 text-white/30" />
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link to={`/courses/${course._id}`}>
                    <h3 className="font-display font-semibold text-white text-sm line-clamp-2 hover:text-indigo-300 transition-colors">
                      {course.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-500 mt-0.5">{course.instructor}</p>
                  {course.rating && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-xs text-amber-400 font-bold">{course.rating}</span>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map((s) => (
                          <span key={s} className={`text-[10px] ${s <= Math.round(course.rating) ? 'text-amber-400' : 'text-slate-700'}`}>★</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Price + remove */}
                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  <span className="font-display font-bold text-xl text-white">${course.price}</span>
                  <button
                    onClick={() => removeFromCart(course._id)}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Eliminar
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="text-xs text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Vaciar carrito
            </button>
          </div>

          {/* Order summary */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="glass-panel rounded-3xl p-6 sticky top-24">
              <h2 className="font-display font-bold text-lg text-white mb-6">Resumen del pedido</h2>

              {/* Prices */}
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Subtotal ({cart.length} cursos)</span>
                  <span className="text-white font-medium">${total.toFixed(2)}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400 flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> Descuento (15%)</span>
                    <span className="text-green-400 font-medium">-${discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="divider mb-5"></div>

              <div className="flex justify-between mb-6">
                <span className="font-display font-bold text-lg text-white">Total</span>
                <span className="font-display font-bold text-2xl text-white">${finalTotal.toFixed(2)}</span>
              </div>

              {/* Coupon */}
              <div className="mb-5">
                <label className="text-xs font-semibold text-slate-400 mb-2 block">Cupón de descuento</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="ACADPRO15"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    className="input-field flex-1 text-sm py-2"
                  />
                  <button
                    onClick={handleCoupon}
                    disabled={couponApplied}
                    className="btn-outline px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap cursor-pointer disabled:opacity-50"
                  >
                    <Tag className="w-4 h-4" />
                  </button>
                </div>
                {couponError && <p className="text-xs text-rose-400 mt-1.5">{couponError}</p>}
                {couponApplied && (
                  <p className="text-xs text-green-400 mt-1.5 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> ¡Cupón aplicado!
                  </p>
                )}
              </div>

              {/* Checkout button */}
              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="w-full btn-gradient text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-60 mb-3"
              >
                {checkingOut ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Procesando...</>
                ) : (
                  <><CreditCard className="w-4 h-4" /> Pagar ahora · ${finalTotal.toFixed(2)}</>
                )}
              </button>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-600">
                <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Pago seguro</span>
                <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Garantía 30 días</span>
              </div>

              <div className="divider mt-5 mb-4"></div>

              <Link to="/courses" className="block text-center text-xs text-indigo-400 hover:underline flex items-center justify-center gap-1">
                Seguir comprando <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}