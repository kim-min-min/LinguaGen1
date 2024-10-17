import React from 'react'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const Notice = () => {
  return (
    <div className='w-full bg-white flex flex-col p-12 justify-start items-center' style={{ height: '850px' }}>
      <p className='font-bold text-xl'>공지사항</p>
      <div className='mt-12 w-full h-full flex flex-col bg-transparent'>
        <div className='w-full h-20 border-b-2 border-gray-300 flex justify-end items-center gap-4'>
          <Checkbox id="notNotice" />
          <label htmlFor='notNotice' className='text-sm font-medium leading-none pear-disabled:cursor-not-allowed peer-disabled:opacity-70'>
            공지 숨기기
          </label>
          <Separator className='h-8' orientation="vertical" />
          <img src="src/assets/imgs/sort_card.png" alt="" className='w-8 h-8' />
          <img src="src/assets/imgs/sort_card2.png" alt="" className='w-8 h-8' />
          <Select>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="15개씩" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="five">5개씩</SelectItem>
              <SelectItem value="ten">10개씩</SelectItem>
              <SelectItem value="fifteen">15개씩</SelectItem>
              <SelectItem value="twenty">20개씩</SelectItem>
              <SelectItem value="thirty">30개씩</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export default Notice