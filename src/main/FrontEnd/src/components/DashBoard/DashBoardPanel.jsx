import React from 'react'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

import BronzeTier from '../../assets/imgs/Tiers/Bronze Tier.png'
import WeeklyLearning from '../WeeklyLearning';
import HeatMap from '../HeatMap'
import CustomLineChart from '../CustomLineChart'
import CustomRadicalChart from '../CustomRadicalChart';

const MistakeWord = [
    {
        id : 1,
        word : 'abandon',
        percentage : '48%',
        meaning : '버리다'
    },
    {
        id : 2,
        word : 'mistake',
        percentage : '21%',
        meaning : '실수'
    },
    {
        id : 3,
        word : 'slack',
        percentage : '18%',
        meaning : '망치'
    },
    {
        id : 4,
        word : 'illigal',
        percentage : '12%',
        meaning : '불법'
    },
    {
        id : 5,
        word : 'stash',
        percentage : '10%',
        meaning : '창고'
    },
    {
        id : 6,
        word : 'branch',
        percentage : '7%',
        meaning : '가지'
    },
    
]

const DashBoardPanel = () => {
  return (
    <div className='flex flex-col items-center justify-start w-full pt-20 pl-24'> {/* h-full 제거 */}
                <div className='w-full'><h4 className='font-bold'>대쉬보드</h4></div>
                <div className='flex flex-col items-start justify-start w-full'> {/* h-full 제거 */}
                    <div className='flex flex-row justify-start w-full h-86 mt-10' style={{width : '945px'}}>
                        <div className='flex flex-col w-1/2 h-full gap-4'>
                            <Card className='w-full h-1/2'>
                                <CardHeader className='flex flex-row justify-between items-center'>
                                    <CardTitle> 최근 Play </CardTitle>
                                    <CardDescription style={{cursor : 'pointer'}}> Play 내역 {'>'} </CardDescription>
                                </CardHeader>
                                <CardContent className='flex flex-col '>
                                    <p className='font-bold text-xl'> 문법 Level 4  </p>
                                    <p> 3/10</p>
                                </CardContent>
                            </Card>
                            <Card className='w-full h-74'>
                                <CardHeader className='flex flex-row justify-between items-center'>
                                    <CardTitle className='text-md'> 현재 티어 - Bronze 4</CardTitle>
                                </CardHeader>
                                <CardContent className='flex flex-row items-center'>
                                    <img src={BronzeTier} alt='Bronze Tier' className='w-20 h-20'/>
                                    <p className='font-bold text-md ml-10'> Bronze 3 까지 남은 포인트 : 1000</p>
                                </CardContent>
                            </Card>
                        </div>
                        <div className='flex w-1/2' style={{height : '345px'}}>
                            <WeeklyLearning />
                        </div>
                    </div>
                    <div className='flex pt-8' style={{width : '945px'}}>
                        <Card className='w-full h-full'>
                            <CardHeader className='p-4 pl-8 text-md font-bold'>
                                <h2>1년간 Play</h2>
                            </CardHeader>
                            <CardContent>
                                <HeatMap/>
                            </CardContent>
                        </Card>
                    </div>
                    <div className='grid grid-cols-3 gap-4 w-full mb-24 mt-8' style={{height : '450px' , width : '945px'}}>
                        <Card className='w-full h-full'>
                            <CardHeader className='p-4 pl-8 text-md font-bold border-b-2 border-gray-300'>
                                <h2>자주 틀린 단어</h2>
                            </CardHeader>
                            <CardContent className='mt-4'>
                                <ul>
                                    {MistakeWord.map((word) => (
                                        <li key={word.id} className='flex flex-row items-center justify-between border-b-2 border-gray-300 mb-4 pb-4'>
                                            <p className='font-bold hover:scale-125 transition-all duration-300 cursor-pointer' style={{userSelect : 'none'}}>{word.word}</p>
                                            <p className='text-sm text-gray-500' style={{userSelect : 'none'}}>{word.percentage}</p>
                                            <p style={{userSelect : 'none'}}>{word.meaning}</p>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter className='flex flex-row justify-end'>
                                <CardDescription style={{cursor : 'pointer'}}>
                                더보기 {'>'}
                                </CardDescription>
                            </CardFooter>
                        </Card>
                        <CustomLineChart className='w-full h-full'/>
                        <CustomRadicalChart className='w-full h-full' />
                    </div>
                </div>
            </div>
  )
}

export default DashBoardPanel