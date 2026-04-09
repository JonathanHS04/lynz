import React from 'react'

const SpotlightSection = () => {
  return (
    <section className="space-y-6">
                  <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                      <h2 className="mt-3 text-3xl font-black uppercase tracking-tighter text-white">Top la semana</h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    {weeklySpotlight.map((item) => (
                      <SpotlightCard key={`${item.type}-${item.title}`} item={item} />
                    ))}
                  </div>
                </section>
  )
}

export default SpotlightSection