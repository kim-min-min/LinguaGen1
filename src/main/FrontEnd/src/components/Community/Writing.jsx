import React, { useEffect, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useParams, useLocation } from 'react-router-dom';

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import useStore from "@/store/useStore.js";
import axios from "axios";

const FormSchema = z.object({
    title: z.string().min(2, {
        message: "제목은 2글자 이상 작성해야합니다.",
    }),
    category: z.string().nonempty({
        message: "카테고리를 선택해주세요.",
    }),
    content: z.string().min(1, {
        message: "내용을 입력해주세요.",
    }),
});

const Writing = ({ handleTabClick, currentBoard }) => {
    const { board } = useParams();
    const location = useLocation();
    const [currentCategory, setCurrentCategory] = useState(board || currentBoard || '');

    useEffect(() => {
        const path = location.pathname.split('/');
        const category = path[path.length - 2];
        setCurrentCategory(category);
    }, [location]);

    const { isLoggedIn, setIsLoggedIn } = useStore();
    const [id, setId] = useState("");

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: "",
            category: currentCategory,
            content: "",
        },
    });

    useEffect(() => {
        const fetchUserData = async () => {
            const user = sessionStorage.getItem('user');
            if (user) {
                setIsLoggedIn(true);
                const userData = JSON.parse(user);
                try {
                    const userResponse = await axios.get(`http://localhost:8085/api/users/${userData.id}`, { withCredentials: true });
                    setId(userResponse.data.id);
                } catch (error) {
                    console.error('사용자 정보를 가져오는 중 오류 발생:', error);
                }
            }
        };

        fetchUserData();
    }, [setIsLoggedIn]);

    const onSubmit = (data) => {
        const formData = { ...data, userId: id };
        console.log('Submitting data:', formData);
        fetch('http://localhost:8085/api/community', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                // 현재 게시판으로 이동
                handleTabClick(currentCategory);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <div className="w-full bg-white rounded-md flex flex-col p-12 justify-start items-center">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                    <FormField
                        control={form.control}
                        name="title"
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

                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>카테고리 선택</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} defaultValue={currentBoard}>
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

                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>내용 입력</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="내용을 입력하세요" style={{ width: '650px', height: '550px' }} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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
