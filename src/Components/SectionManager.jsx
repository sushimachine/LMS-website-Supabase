import React, {useState} from 'react'
import { useGetSectionsForCourseQuery, useAddSectionMutation } from '../store/apiSlice'
import Dropdown from './Dropdown';
import ChapterList from './ChapterList';
import { toast} from 'react-toastify';
import { MdDelete } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { FiSave } from "react-icons/fi";

function SectionManager({courseId}) {
   const {data : sections, isLoading : isSectionLoading} = useGetSectionsForCourseQuery(courseId, {
    skip: !courseId 
})
    const [addSection] = useAddSectionMutation()
    const [isAdd, setIsAdd] = useState(false)
    const [ isSubtitle, setIsSubtitle ] = useState("");
    const [isTitle, setIsTitle] = useState("");

    const AddTheSection = async (e) => {
        e.preventDefault();
        try {
        await addSection({
            title: isTitle,
            course_id: courseId,
            Subtitle: isSubtitle
        }).unwrap();
        
        setIsTitle("");
        setIsAdd(false);
        setIsSubtitle("");
        toast.success("Section added!");
        } catch (error) {
        toast.error("Failed to add section");
        }
    };

    if(isSectionLoading) return <div>loading section.....</div>

  return (
    <div className='h-full w-3/4 m-6'>
      <h1 className='text-2xl font-bold ml-2.5'>Course Chapter</h1>
      {Array.isArray(sections) && sections.map((section) => (
        <Dropdown
        key={section.id}
          course_Id={courseId}
          id={section.id}
          title={section.title}
          subtitle={section.subtitle}
          edit={true}
        >
            <ChapterList sectionId={section.id} edit={true} />
        </Dropdown>
      ))}

    <button
        onClick={() => {
            setIsAdd(true);
        }}
        className="bg-blue-500 text-white px-3 py-1 ml-3 rounded">
        Add Section
    </button>

      {isAdd && 
          <form onSubmit={AddTheSection} className="p-4 gap-3 h-65 w-full flex flex-col bg-gray-100 rounded-md mt-4">
              <h4 className="font-bold mb-2 text-[20px]">New Section</h4>
              <div className='flex flex-col w-9/10'>
                <label htmlFor="edit-title">Title:</label>
                <input 
                    type="text" 
                    id='edit-title' 
                    onChange={(e) => setIsTitle(e.target.value)}
                    className='border px-2 py-1 mr-3'
                />
              </div>
              <div className='flex flex-col w-9/10'>
                <label htmlFor="edit-Subtitle">Subtitle:</label>
                <input 
                    type="text" 
                    id='edit-duration' 
                    onChange={(e) => setIsSubtitle(e.target.value)} 
                    className='border px-2 py-1 mr-3'
                />
              </div>
              <div className='flex justify-end'>
                <button type="submit" className="h-13 text-center bg-blue-500 text-white px-3 py-1 rounded">
                    <FiSave /> Save
                </button>
                <button type="button" onClick={() => {setIsAdd(false)}} className="bg-gray-300 ml-2 px-3 py-1 rounded">
                    Cancel
                </button>
              </div>
          </form>
      }
    </div>
  )
}

export default SectionManager
