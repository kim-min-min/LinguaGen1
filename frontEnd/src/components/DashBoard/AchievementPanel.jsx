import React from 'react'

const AchievementPanel = () => {
  return (
    <div className='flex flex-col items-center justify-start w-full pt-20 pl-24'>
        <div className='w-full'><h4 className='font-bold'>업적</h4></div>
        <div className='flex flex-col items-start justify-start w-full'> {/* h-full 제거 */}
                    <div className='flex flex-row justify-start w-full h-86 mt-10' style={{width : '945px'}}>
                        <div className='flex flex-col w-1/2 h-full gap-4'></div>
        </div>
        </div>
    </div>
  )
}

export default AchievementPanel
