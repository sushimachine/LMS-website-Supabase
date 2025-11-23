import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import SectionManager from '../../Components/SectionManager';
import { 
  useGetCourseDetailQuery, 
  useUpdateCourseMutation,
  useGetChapterForSectionQuery,
  useGetSectionsForCourseQuery 
} from '../../store/apiSlice';
import { uploadCourseImage } from '../../Services/storageService';

function EditCourse() {

  const { courseId } = useParams(); 

  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  
 
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  const { data: course, isLoading : isCourseLoading } = useGetCourseDetailQuery(courseId);

  useEffect(() => {
    if (course) {
      reset({
        title: course.title,
        description: course.description,
        price: course.price,
      });
    }
  }, [course, reset]);

  const onSaveDetails = async (data) => {
    try{
      const imageFile = data.image[0]
      let imageUrl = null
      if(imageFile){
        toast.info('uploading image....')
        imageUrl = await uploadCourseImage(imageFile);
        toast.success('image uloaded succesfully')
      }

      const newCourseInfo = {
        id: courseId,
        title : data.title,
        description : data.description,
        price : data.price,
        imgUrl : imageUrl,
      }

      await updateCourse(newCourseInfo).unwrap()
    }
    catch(error){
        console.log("failed to add course :" , error)
        toast.error('failed to add')
    }
  };

  if (isCourseLoading) return <div>Loading course data...</div>;

  return (
    <div className='w-full flex flex-row m-4'>
      <div className='w-1/2 flex flex-col m-2'>
        <h1 className='font-bold text-2xl ml-4'>Edit Course: <span className='font-normal'>{course?.title}</span></h1>
      
      <form onSubmit={handleSubmit(onSaveDetails)} className="w-full m-6 flex flex-col gap-6">
        
        <div className="h-15 w-3/4 flex flex-col justify-around">
          <label htmlFor="title" className="font-semibold">Title</label>
          <input 
            type="text" 
            id="title"
            className="w-full h-8 p-4 mt-2 border"
            placeholder="Enter the title"
            {...register("title", { required: true })}
          />
          {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
        </div>


        <div className="h-20 w-3/4 flex flex-col gap-2">
          <label htmlFor="description" className="font-semibold">Description</label>
          <input 
            type="text"
            id="description"
            className="h-15 w-full pl-4 pt-1 border"
            {...register("description", { required: true })} 
          />
        </div>

        <div className="h-15 w-3/4 flex flex-col gap-2">
          <label htmlFor="price">Course Price</label>
          <input 
            type="text" 
            id="price"
            className="h-7 w-full p-4 border"
            {...register("price", { required: true, valueAsNumber: true })} 
          />
        </div>

        <div className="h-9 w-3/4 mt-4 flex flex-row gap-2 justify-center items-center">
          <img 
            src={course.imageUrl} 
            alt={course.title} 
            className="h-16 w-full object-cover rounded" 
          />
          
          <label className="font-semibold">Update Image:</label>
          <input type="file" accept="image/*" {...register("image")} />
        </div>

        <div className="h-9 w-3/4 mt-2 text-[#FFFFFF] flex justify-end">
          <button type="submit" className="h-full w-1/4 border bg-[#2563EB]" disabled={isUpdating}>
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </form>
      </div>

      <div className='w-1/2 flex flex-col'>
        <SectionManager courseId={courseId} />
      </div>
    </div>
  );
}

export default EditCourse;