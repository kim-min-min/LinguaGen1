import React, { useEffect, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useParams, useNavigate, useLocation } from 'react-router-dom';

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

// Validation schema
const FormSchema = z.object({
    title: z.string().min(2, { message: "제목은 2글자 이상 작성해야합니다." }),
    category: z.string().nonempty({ message: "카테고리를 선택해주세요." }),
    content: z.string().min(1, { message: "내용을 입력해주세요." }),
});

const EditPost = ({ handleTabClick }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoggedIn, setIsLoggedIn } = useStore();

    const [userId, setUserId] = useState("");
    const [currentCategory, setCurrentCategory] = useState('');

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: "",
            category: "",
            content: "",
        },
    });

    // Load existing post data
    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const response = await axios.get(`http://localhost:8085/api/community/${id}`);
                const { title, category, content } = response.data;
                form.reset({ title, category, content });
                setCurrentCategory(category);
            } catch (error) {
                console.error('Error fetching post data:', error);
            }
        };

        fetchPostData();
    }, [id, form]);

    // Fetch logged-in user data
    useEffect(() => {
        const fetchUserData = async () => {
            const user = sessionStorage.getItem('user');
            if (user) {
                setIsLoggedIn(true);
                const userData = JSON.parse(user);
                try {
                    const userResponse = await axios.get(`http://localhost:8085/api/users/${userData.id}`, { withCredentials: true });
                    setUserId(userResponse.data.id);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchUserData();
    }, [setIsLoggedIn]);

    // Submit updated post data
    const onSubmit = (data) => {
        const formData = { ...data, userId };
        axios.put(`http://localhost:8085/api/community/${id}`, formData)
            .then(() => {
                // Navigate back to the updated post
                handleTabClick(formData.category || currentCategory);
                navigate(`/community/${formData.category || currentCategory}/${id}`);
            })
            .catch((error) => {
                console.error('Error updating post:', error);
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
                                    <Select onValueChange={field.onChange} defaultValue={currentCategory}>
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
                        <Button type="submit">Save</Button>
                        <Button variant="outline" className="ml-4" onClick={() => navigate(-1)}>
                            취소
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default EditPost;
