import React, { useState } from 'react'; 
import { useDeleteChapterMutation, useUpdataChapterMutation, useGetChapterForSectionQuery, useAddChapterMutation } from '../store/apiSlice'; 
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { FiSave } from "react-icons/fi"; 
import { toast } from 'react-toastify'; 

function ChapterList({sectionId: sectionId, edit}){ 

    const {data : chapters, isLoading : isChaptertloading} = useGetChapterForSectionQuery(sectionId, {
    skip: !sectionId 
})
    const [ AddChapter ] = useAddChapterMutation()
    const [isEditing, setIsEditing] = useState(false);
    const [isAdd, setIsAdd] = useState(false)
    const [istitle, setIstitle] = useState(""); 
    const [isduration, setIsduration] = useState("");
    const [isid, setIsid] = useState(null); 
    const AddTheChapter = async (e) => {
        e.preventDefault();
        try {
            const info = {
                title : istitle,
                duration : isduration,
                videoUrl : null,
                section_id : sectionId
            }

            await AddChapter(info)
            setIsEditing(false)
            setIsAdd(false)

            toast.success("Chapter added successfully!");
        } catch (error) {
            toast.error("Failed to save chapter. Check console.");
        }
    }

    const [ deleteChapter ] = useDeleteChapterMutation();
    const [ updataChapter ] = useUpdataChapterMutation();

    const EditTheChapter = async (e) => {
        e.preventDefault(); 
        try {
            const updatedChapterData = {
                id: isid, 
                title: istitle,
                duration: isduration,
            };
            await updataChapter(updatedChapterData).unwrap();
            
            setIsEditing(false); 
            toast.success("Chapter updated successfully!");
        } catch (error) {
            toast.error("Failed to update chapter. Check console.");
        }
    }

    const handleDelete = async (chapterId) => { 
        if (window.confirm(`Are you sure you want to delete this chapter?`)) {
            try {
                await deleteChapter(chapterId).unwrap(); 
                toast.success("Chapter deleted successfully."); 
            } catch (error) {
                toast.error("Failed to delete chapter."); 
            }
        }
    };

    if (isChaptertloading) return <div>Loading Chapters...</div>;


    return (
        <div className='flex flex-col gap-2'>
            {Array.isArray(chapters) && chapters.map((chapter) => (
                <div key={chapter.id} className="flex justify-between items-center p-2 border-b">
                    
                    <p className="w-1/2">{chapter.title}</p>
                    <p className="w-1/4">{chapter.duration}</p>

                    {edit && 
                        <div className="flex gap-2">
                            <FaRegEdit
                                onClick={() => {
                                    setIsEditing(true);
                                    setIstitle(chapter.title); 
                                    setIsduration(chapter.duration); 
                                    setIsid(chapter.id);
                                }}
                                className="hover:text-blue-500 transition cursor-pointer"
                            />
                            
                            <MdDelete 
                                onClick={() => handleDelete(chapter.id)} 
                                className="hover:text-red-500 transition cursor-pointer" 
                            />
                        </div>
                    }
                </div>
            ))}
            {edit && <button
                onClick={() => {setIsEditing(true);
                    setIsAdd(true);
                }}
                className="bg-blue-500 text-white px-3 py-1 rounded">
                Add Chapter
            </button>}

            {isEditing && 
                <form onSubmit={isAdd ? AddTheChapter : EditTheChapter} className="p-4 rounded-md mt-4">
                    <h4 className="font-bold mb-2">Editing: </h4>
                    <label htmlFor="edit-title">Title:</label>
                    <input 
                        type="text" 
                        id='edit-title' 
                        value={!isAdd ? istitle : ""}
                        onChange={(e) => setIstitle(e.target.value)}
                        className='border px-2 py-1 mr-3'
                    />

                    <label htmlFor="edit-duration">Duration:</label>
                    <input 
                        type="text" 
                        id='edit-duration' 
                        value={!isAdd ? isduration : ""} 
                        onChange={(e) => setIsduration(e.target.value)} 
                        className='border px-2 py-1 mr-3'
                    />

                    <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
                        <FiSave /> Save
                    </button>
                    <button type="button" onClick={() => {setIsEditing(false); setIsAdd(false);}} className="bg-gray-300 ml-2 px-3 py-1 rounded">
                        Cancel
                    </button>
                </form>
            }
        </div>
    )
}

export default ChapterList;