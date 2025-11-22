import { createApi } from "@reduxjs/toolkit/query/react";
import supabaseService from "../Auth/SupabaseService";
import { supabase } from '../conf/conf';

const fakebaseQuery = () => ({
    data : {}
})

export const apiSlice = createApi({

    reducerPath : 'api',
    baseQuery : fakebaseQuery,

    tagTypes : ['courses', 'section', 'chapter', 'section', 'chapter'],

    endpoints : (builder) => ({
        getCourses : builder.query({
            async queryFn(){
                try{
                    const {data, error} = await supabase.from('courses').select('*')
                    if(error) throw error
                    return {data : data};
                }
                catch(error){
                    return {error : {status : error.code, data : error.data}}
                }
            },
            providesTags : ['courses'],
        }),
        
        addCourses: builder.mutation({
            async queryFn(newCourse){
                try{
                    const {data, error} = await supabase.from('courses').insert(newCourse).select()
                    if(error) throw error

                    return {data : data}
                }
                catch(error){
                    return {error : {status : error.code, data : error.data}}
                }
            },
            invalidatesTags : ['courses']
        }),

        getCourseDetail : builder.query({
            async queryFn(uId){
                try{
                    const {data, error} = await supabase.from('courses').select('*').eq('id', uId).single()
                    if(error) throw error

                    return {data : data}
                }
                catch(error){
                    return {error : {status : error.code, data : error.data}}
                }
            },
            providesTags: (result, error, id) => [{ type: 'courses', id: id }]
        }),

        getSectionsForCourse : builder.query({
            async queryFn(Id){
                try{
                    const {data, error} = await supabase.from('section').select('*').eq('course_id', Id)
                    if(error) throw error

                    return {data : data}
                }
                catch(error){
                    return {error : {status : error.code, data : error.data}}
                }
            },
            providesTags : ['section']

        }),

        getChapterForSection : builder.query({
            async queryFn(Id){
                try{
                    const {data, error} = await supabase.from('chapter').select('*').eq('section_id', Id)

                    if(error) throw error 

                    return {data : data}
                }
                catch(error){
                    return {error : {status : error.code, data : error.data}}
                }
            },
            providesTags : ['chapter']
        }),

        AddSection : builder.mutation({
            async queryFn(newSection){
                try {
                    const {data, error} = await supabase.from('section').insert(newSection).select()
                    if(error) throw error

                    return {data : data[0]}
                } catch (error) {
                    return {error : {status : error.code, data : error.data}}
                }
            },
            invalidatesTags : ['section']
        }), 

        updateSection : builder.mutation({
            async queryFn(upadatedSection){
                try{
                    const {data, error} = await supabase.from('section').update(upadatedSection).eq('id', upadatedSection.id).select()
                    if(error) throw error 

                    return {data : data}
                }
                catch(error){
                    return {error : {status : error.code, data : error.data}}
                }
            },

            invalidatesTags : ['section']

        }),

        deleteSection : builder.mutation({
            async queryFn(Id){
                try {
                    const {data, error} = await supabase.from('section').delete().eq('id', Id)
                    if(error) throw error
                    
                    return {data : data}
                } catch (error) {
                    return {error : {status : error.code, data : error.data}}
                }
            },
            invalidatesTags : ['section']
        }),

        AddChapter : builder.mutation({
            async queryFn(newChapter){
                try {
                    const {data, error} = await supabase.from('Chapter').insert(newChapter).select()
                    if(error) throw error

                    return {data : data[0]}
                } catch (error) {
                    return {error : {status : error.code, data : error.data}}
                }
            },
            invalidatesTags : ['chapter']
        }), 

        updataChapter : builder.mutation({
            async queryFn(upadatedChapter){
                try{
                    const {data, error} = await supabase.from('chapter').update(upadatedChapter).eq('id', upadatedChapter.id).select()
                    if(error) throw error 

                    return {data : data}
                }
                catch(error){
                    return {error : {status : error.code, data : error.data}}
                }
            },
            invalidatesTags : ['chapter']
        }),

        deleteChapter : builder.mutation({
            async queryFn(Id){
                try {
                    const {data, error} = await supabase.from('chapter').delete().eq('id', Id)
                    if(error) throw error
                    
                    return {data : data}
                } catch (error) {
                    return {error : {status : error.code, data : error.data}}
                }
            },
            invalidatesTags : ['chapter']
        }),

        getTeacherCourse : builder.query({
            async queryFn(teacher_Id){
                try {
                    const {data, error} = await supabase.from('courses').select('*').eq('user_id', teacher_Id)
                    if(error) throw error

                    return {data : data}
                } catch (error) {
                    return {error : {status : error.code, data : error.data}}
                }
            },
            providesTags : ['courses']
        }),

        updateCourse: builder.mutation({
            async queryFn(updatedCourse) {
                try {
                const { id, ...courseData } = updatedCourse;
                
                const { data, error } = await supabase
                    .from('courses')
                    .update(courseData) 
                    .eq('id', id)       
                    .select();

                if (error) throw error;
                return { data: data[0] };
                } catch (error) {
                return { error };
                }
            },
            invalidatesTags: (result, error, updatedCourse) => [
                'courses', 
                { type: 'courses', id: updatedCourse.id }
            ],
        }),

        deleteCourse: builder.mutation({
            async queryFn(courseId) {
                try {
                const { data, error } = await supabase
                    .from('courses')
                    .delete()
                    .eq('id', courseId);
                    
                if (error) throw error;
                return { data };
                } catch (error) {
                return { error };
                }
            },
            invalidatesTags: ['courses'], 
        }),

    }),

});

export const {useGetCoursesQuery, useAddCoursesMutation, useGetCourseDetailQuery,
     useGetChapterForSectionQuery, useGetSectionsForCourseQuery,
    useAddChapterMutation, useAddSectionMutation, useDeleteChapterMutation, useDeleteSectionMutation,
    useUpdataChapterMutation, useUpdateSectionMutation, useGetTeacherCourseQuery, useDeleteCourseMutation,
    useUpdateCourseMutation} = apiSlice