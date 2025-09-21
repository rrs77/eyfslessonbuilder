import React, { useState, useEffect } from 'react';
import { CreditCard, ShoppingCart, CheckCircle, XCircle, Lock, Star } from 'lucide-react';

interface PurchasableItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  type: 'year-group' | 'activity-pack' | 'premium-feature';
  yearGroups?: string[];
  activities?: string[];
  features?: string[];
  isPopular?: boolean;
}

interface PayPalIntegrationProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem?: PurchasableItem;
  onPurchaseComplete?: (item: PurchasableItem, transactionId: string) => void;
}

export function PayPalIntegration({ isOpen, onClose, selectedItem, onPurchaseComplete }: PayPalIntegrationProps) {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [transactionId, setTransactionId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Mock purchasable items - in a real app, these would come from your API
  const purchasableItems: PurchasableItem[] = [
    {
      id: 'year-group-lkg',
      name: 'LKG Year Group',
      description: 'Complete LKG curriculum with all activities, lesson plans, and resources',
      price: 29.99,
      currency: 'GBP',
      type: 'year-group',
      yearGroups: ['LKG'],
      activities: ['lkg-activities'],
      isPopular: true
    },
    {
      id: 'year-group-ukg',
      name: 'UKG Year Group',
      description: 'Complete UKG curriculum with all activities, lesson plans, and resources',
      price: 29.99,
      currency: 'GBP',
      type: 'year-group',
      yearGroups: ['UKG'],
      activities: ['ukg-activities']
    },
    {
      id: 'year-group-reception',
      name: 'Reception Year Group',
      description: 'Complete Reception curriculum with all activities, lesson plans, and resources',
      price: 29.99,
      currency: 'GBP',
      type: 'year-group',
      yearGroups: ['Reception'],
      activities: ['reception-activities']
    },
    {
      id: 'music-activities-pack',
      name: 'Music Activities Pack',
      description: 'Premium music activities for all year groups including songs, instruments, and games',
      price: 19.99,
      currency: 'GBP',
      type: 'activity-pack',
      activities: ['music-activities'],
      features: ['Songs Library', 'Instrument Guides', 'Music Games']
    },
    {
      id: 'drama-activities-pack',
      name: 'Drama Activities Pack',
      description: 'Comprehensive drama activities including games, exercises, and performance pieces',
      price: 19.99,
      currency: 'GBP',
      type: 'activity-pack',
      activities: ['drama-activities'],
      features: ['Drama Games', 'Performance Pieces', 'Character Development']
    },
    {
      id: 'premium-features',
      name: 'Premium Features',
      description: 'Unlock advanced features including custom activity creation, advanced analytics, and priority support',
      price: 9.99,
      currency: 'GBP',
      type: 'premium-feature',
      features: ['Custom Activities', 'Advanced Analytics', 'Priority Support', 'Export Options']
    }
  ];

  const handlePurchase = async (item: PurchasableItem) => {
    setLoading(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      // In a real app, this would integrate with PayPal SDK
      // For now, we'll simulate the payment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful payment
      const mockTransactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setTransactionId(mockTransactionId);
      setPaymentStatus('success');
      
      // Call the completion callback
      if (onPurchaseComplete) {
        onPurchaseComplete(item, mockTransactionId);
      }
    } catch (error) {
      setPaymentStatus('error');
      setErrorMessage('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetPayment = () => {
    setPaymentStatus('idle');
    setTransactionId('');
    setErrorMessage('');
  };

  useEffect(() => {
    if (!isOpen) {
      resetPayment();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Purchase Items</h2>
            <p className="text-sm text-gray-600">Unlock premium content and features</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {paymentStatus === 'success' ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-4">Your purchase has been completed successfully.</p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">Transaction ID: {transactionId}</p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Continue
              </button>
            </div>
          ) : paymentStatus === 'error' ? (
            <div className="text-center py-8">
              <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Failed</h3>
              <p className="text-gray-600 mb-4">{errorMessage}</p>
              <button
                onClick={resetPayment}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchasableItems.map((item) => (
                <div
                  key={item.id}
                  className={`relative bg-white border-2 rounded-xl p-6 hover:border-blue-300 transition-colors ${
                    item.isPopular ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  {item.isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                        <Star className="h-3 w-3" />
                        <span>Most Popular</span>
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  </div>
                  
                  <div className="text-center mb-6">
                    <span className="text-3xl font-bold text-gray-900">£{item.price}</span>
                    <span className="text-gray-600 ml-1">/{item.currency}</span>
                  </div>
                  
                  {item.features && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Includes:</h4>
                      <ul className="space-y-1">
                        {item.features.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <button
                    onClick={() => handlePurchase(item)}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4" />
                        <span>Purchase Now</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <Lock className="h-4 w-4" />
            <span>Secure payment powered by PayPal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
