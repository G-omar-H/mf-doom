'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Ruler, Globe, Info } from 'lucide-react'
import { Button } from './Button'

interface SizeChartProps {
  category?: 'clothing' | 'shoes' | 'accessories' | 'headwear'
  productName?: string
}

interface SizeData {
  US: string
  EU: string
  UK: string
  Asia: string
  measurements?: {
    chest?: string
    waist?: string
    length?: string
    sleeve?: string
    foot?: string
    head?: string
  }
}

interface CategoryChart {
  [key: string]: SizeData
}

const sizeCharts: Record<string, CategoryChart> = {
  clothing: {
    XS: {
      US: 'XS',
      EU: '32-34',
      UK: '6-8',
      Asia: 'S',
      measurements: {
        chest: '31-33"',
        waist: '24-26"',
        length: '26"',
        sleeve: '32"'
      }
    },
    S: {
      US: 'S',
      EU: '36-38',
      UK: '8-10',
      Asia: 'M',
      measurements: {
        chest: '34-36"',
        waist: '27-29"',
        length: '27"',
        sleeve: '33"'
      }
    },
    M: {
      US: 'M',
      EU: '40-42',
      UK: '10-12',
      Asia: 'L',
      measurements: {
        chest: '37-39"',
        waist: '30-32"',
        length: '28"',
        sleeve: '34"'
      }
    },
    L: {
      US: 'L',
      EU: '44-46',
      UK: '12-14',
      Asia: 'XL',
      measurements: {
        chest: '40-42"',
        waist: '33-35"',
        length: '29"',
        sleeve: '35"'
      }
    },
    XL: {
      US: 'XL',
      EU: '48-50',
      UK: '14-16',
      Asia: 'XXL',
      measurements: {
        chest: '43-45"',
        waist: '36-38"',
        length: '30"',
        sleeve: '36"'
      }
    },
    XXL: {
      US: 'XXL',
      EU: '52-54',
      UK: '16-18',
      Asia: 'XXXL',
      measurements: {
        chest: '46-48"',
        waist: '39-41"',
        length: '31"',
        sleeve: '37"'
      }
    }
  },
  shoes: {
    6: {
      US: '6',
      EU: '39',
      UK: '5.5',
      Asia: '24.5',
      measurements: {
        foot: '9.25"'
      }
    },
    7: {
      US: '7',
      EU: '40',
      UK: '6.5',
      Asia: '25',
      measurements: {
        foot: '9.625"'
      }
    },
    8: {
      US: '8',
      EU: '41',
      UK: '7.5',
      Asia: '26',
      measurements: {
        foot: '10"'
      }
    },
    9: {
      US: '9',
      EU: '42',
      UK: '8.5',
      Asia: '27',
      measurements: {
        foot: '10.375"'
      }
    },
    10: {
      US: '10',
      EU: '43',
      UK: '9.5',
      Asia: '28',
      measurements: {
        foot: '10.75"'
      }
    },
    11: {
      US: '11',
      EU: '44',
      UK: '10.5',
      Asia: '29',
      measurements: {
        foot: '11.125"'
      }
    },
    12: {
      US: '12',
      EU: '45',
      UK: '11.5',
      Asia: '30',
      measurements: {
        foot: '11.5"'
      }
    }
  },
  headwear: {
    S: {
      US: 'S (7-7⅛)',
      EU: '55-56',
      UK: '6⅞-7',
      Asia: 'M',
      measurements: {
        head: '21.5-22"'
      }
    },
    M: {
      US: 'M (7¼-7⅜)',
      EU: '57-58',
      UK: '7⅛-7¼',
      Asia: 'L',
      measurements: {
        head: '22.5-23"'
      }
    },
    L: {
      US: 'L (7½-7⅝)',
      EU: '59-60',
      UK: '7⅜-7½',
      Asia: 'XL',
      measurements: {
        head: '23.5-24"'
      }
    },
    XL: {
      US: 'XL (7¾-8)',
      EU: '61-62',
      UK: '7⅝-7¾',
      Asia: 'XXL',
      measurements: {
        head: '24.5-25"'
      }
    }
  },
  accessories: {
    OS: {
      US: 'One Size',
      EU: 'Taille Unique',
      UK: 'One Size',
      Asia: 'Free Size',
      measurements: {
        length: 'Adjustable'
      }
    }
  }
}

export default function SizeChart({ category = 'clothing', productName = 'Product' }: SizeChartProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'chart' | 'guide'>('chart')

  const currentChart = sizeCharts[category] || sizeCharts.clothing
  const sizes = Object.keys(currentChart)

  return (
    <>
      {/* Size Chart Trigger Button */}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-sm border border-mf-gray text-mf-gray hover:border-mf-dark-blue hover:text-mf-dark-blue transition-colors bg-white"
      >
        <Ruler size={16} />
        Size Guide
      </Button>

      {/* Size Chart Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-black to-gray-800 text-white p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                      <Ruler size={20} className="text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg sm:text-xl text-white">
                        VILLAIN SIZE GUIDE
                      </h2>
                      <p className="text-gray-300 text-sm">
                        {productName} • {category.charAt(0).toUpperCase() + category.slice(1)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mt-4 bg-white bg-opacity-10 rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab('chart')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                      activeTab === 'chart'
                        ? 'bg-white text-black'
                        : 'text-white hover:bg-white hover:bg-opacity-20'
                    }`}
                  >
                    Size Chart
                  </button>
                  <button
                    onClick={() => setActiveTab('guide')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                      activeTab === 'guide'
                        ? 'bg-white text-black'
                        : 'text-white hover:bg-white hover:bg-opacity-20'
                    }`}
                  >
                    Measuring Guide
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
                {activeTab === 'chart' ? (
                  <div className="space-y-6">
                    {/* International Standards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Globe size={20} className="mx-auto mb-2 text-blue-600" />
                        <p className="font-semibold text-sm">US/CA</p>
                        <p className="text-xs text-gray-600">North America</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Globe size={20} className="mx-auto mb-2 text-green-600" />
                        <p className="font-semibold text-sm">EU</p>
                        <p className="text-xs text-gray-600">Europe</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Globe size={20} className="mx-auto mb-2 text-purple-600" />
                        <p className="font-semibold text-sm">UK</p>
                        <p className="text-xs text-gray-600">United Kingdom</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Globe size={20} className="mx-auto mb-2 text-red-600" />
                        <p className="font-semibold text-sm">Asia</p>
                        <p className="text-xs text-gray-600">Asian Markets</p>
                      </div>
                    </div>

                    {/* Size Chart Table - Mobile Optimized */}
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="text-left p-3 font-semibold text-sm">Size</th>
                            <th className="text-center p-3 font-semibold text-sm">US/CA</th>
                            <th className="text-center p-3 font-semibold text-sm">EU</th>
                            <th className="text-center p-3 font-semibold text-sm">UK</th>
                            <th className="text-center p-3 font-semibold text-sm hidden sm:table-cell">Asia</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sizes.map((size, index) => {
                            const sizeData = currentChart[size] as SizeData
                            return (
                              <tr key={size} className={`border-t ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                <td className="p-3 font-bold text-black">{size}</td>
                                <td className="p-3 text-center text-sm">{sizeData.US}</td>
                                <td className="p-3 text-center text-sm">{sizeData.EU}</td>
                                <td className="p-3 text-center text-sm">{sizeData.UK}</td>
                                <td className="p-3 text-center text-sm hidden sm:table-cell">{sizeData.Asia}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Measurements Table */}
                    {category === 'clothing' && (
                      <div className="mt-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                          <Info size={20} className="text-blue-600" />
                          Detailed Measurements
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                            <thead>
                              <tr className="bg-black text-white">
                                <th className="text-left p-3 font-semibold text-sm">Size</th>
                                <th className="text-center p-3 font-semibold text-sm">Chest</th>
                                <th className="text-center p-3 font-semibold text-sm">Waist</th>
                                <th className="text-center p-3 font-semibold text-sm hidden sm:table-cell">Length</th>
                                <th className="text-center p-3 font-semibold text-sm hidden md:table-cell">Sleeve</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sizes.map((size, index) => {
                                const sizeData = currentChart[size] as SizeData
                                const measurements = sizeData.measurements
                                return (
                                  <tr key={size} className={`border-t ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                    <td className="p-3 font-bold text-red-600">{size}</td>
                                    <td className="p-3 text-center text-sm">{measurements?.chest || '-'}</td>
                                    <td className="p-3 text-center text-sm">{measurements?.waist || '-'}</td>
                                    <td className="p-3 text-center text-sm hidden sm:table-cell">{measurements?.length || '-'}</td>
                                    <td className="p-3 text-center text-sm hidden md:table-cell">{measurements?.sleeve || '-'}</td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Measuring Guide */
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                      <h3 className="font-bold text-lg mb-4 text-black">How to Measure</h3>
                      
                      {category === 'clothing' && (
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="flex gap-3">
                              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                              <div>
                                <h4 className="font-semibold">Chest</h4>
                                <p className="text-sm text-gray-700">Measure around the fullest part of your chest, keeping the tape horizontal.</p>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                              <div>
                                <h4 className="font-semibold">Waist</h4>
                                <p className="text-sm text-gray-700">Measure around your natural waistline, usually the narrowest part of your torso.</p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="flex gap-3">
                              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                              <div>
                                <h4 className="font-semibold">Length</h4>
                                <p className="text-sm text-gray-700">Measure from the highest point of your shoulder to your desired length.</p>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                              <div>
                                <h4 className="font-semibold">Sleeve</h4>
                                <p className="text-sm text-gray-700">Measure from shoulder to wrist with arm slightly bent.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {category === 'shoes' && (
                        <div className="space-y-4">
                          <div className="flex gap-3">
                            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                            <div>
                              <h4 className="font-semibold">Foot Length</h4>
                              <p className="text-sm text-gray-700">Stand on a piece of paper and mark the longest point of your foot. Measure the distance.</p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                            <div>
                              <h4 className="font-semibold">Best Time to Measure</h4>
                              <p className="text-sm text-gray-700">Measure your feet in the evening when they're at their largest.</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {category === 'headwear' && (
                        <div className="space-y-4">
                          <div className="flex gap-3">
                            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                            <div>
                              <h4 className="font-semibold">Head Circumference</h4>
                              <p className="text-sm text-gray-700">Measure around your head about 1 inch above your eyebrows and ears.</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Tips */}
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                      <h4 className="font-semibold text-yellow-800 mb-2">Pro Tips</h4>
                      <ul className="space-y-1 text-sm text-yellow-700">
                        <li>• Use a flexible measuring tape for accurate results</li>
                        <li>• Measure over thin clothing or undergarments</li>
                        <li>• When in doubt, size up for a comfortable fit</li>
                        <li>• Different brands may have slight variations</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t bg-gray-50 p-4 text-center">
                <p className="text-sm text-gray-600">
                  Questions about sizing? Contact our{' '}
                  <span className="font-semibold text-black">VILLAIN Support</span> team
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 