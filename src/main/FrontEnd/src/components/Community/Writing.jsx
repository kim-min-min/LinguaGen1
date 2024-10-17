import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea'; // Assuming you have a Textarea component for large text input

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  category: z.string().nonempty({
    message: "Please select a category.",
  }),
});

const Writing = () => {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      category: "",
    },
  });

  return (
    <div className="w-full bg-white rounded-md flex flex-col p-12 justify-start items-center min-h-screen">
      <Form {...form}>
        <form className="w-2/3 space-y-6">
          {/* 제목 입력 */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>제목</FormLabel>
                <FormControl>
                  <Input placeholder="제목을 입력하세요." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Select 컴포넌트 - 카테고리 선택 */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>카테고리 선택</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="게시판을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="freeboard">자유게시판</SelectItem>
                      <SelectItem value="learningtips">학습 팁 공유</SelectItem>
                      <SelectItem value="clubboard">동아리 게시판</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 450x450 크기의 Textarea */}
          <FormItem>
            <FormLabel>내용 입력</FormLabel>
            <FormControl>
              <Textarea placeholder="내용을 입력하세요" style={{ width: '450px', height: '450px' }} />
            </FormControl>
            <FormMessage />
          </FormItem>

          {/* Submit 버튼 및 이미지 업로드 버튼 */}
          <div className="flex items-center space-x-4">
            <Button type="submit">Submit</Button>
            <Button variant="outline" className="ml-4">
              <label htmlFor="imageUpload" className="cursor-pointer">
                이미지 파일 선택
              </label>
              <input type="file" id="imageUpload" accept="image/*" className="hidden" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Writing;
