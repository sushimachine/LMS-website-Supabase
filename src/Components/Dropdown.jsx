import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { FiSave } from "react-icons/fi";
import { useDeleteSectionMutation, useUpdateSectionMutation, useAddSectionMutation } from "../store/apiSlice";

function Dropdown({ course_Id, id, title, subtitle, children, edit }) {
  const [open, setOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
    
  const [ deleteSection ] = useDeleteSectionMutation(id);
  const [ istitle, setIstitle ] = useState(title); 
  const [ isSubtitle, setIsSubtitle ] = useState(subtitle);
  const [updateSection] = useUpdateSectionMutation(id);
  const EditTheSection = async (e) => {
      e.preventDefault(); 
      try {
          const updatedSectionData = {
              id: id, 
              title: istitle,
              subtitle: isSubtitle,
          };
          
          await updateSection(updatedSectionData).unwrap();
          
          setIsEditing(false); 
          toast.success("Chapter updated successfully!");
      } catch (error) {
          toast.error("Failed to update chapter. Check console.");
      }
  }
  

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete the section? This cannot be undone.`)) {
      try {
        await deleteSection(id).unwrap(); 
        toast.success("Section deleted successfully.");
      } catch (error) {
        toast.error("Failed to delete section.");
      }
    }
  };

  return (
    <div className="border border-gray-700 rounded-md overflow-hidden">
      <div
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center cursor-pointer bg-gray-800 px-4 py-3"
      >
        <div className="text-white font-semibold">{title}</div>
        <div className="text-gray-400">{subtitle}</div>

        {edit && <div>
          <FaRegEdit
            onClick={() => {setIsEditing(true)
              setIstitle(title); 
              setIsSubtitle(subtitle); 
            }} 
            className="hover:text-blue-500 transition"/>

            <MdDelete onClick={handleDelete} 
            className="hover:text-red-500 transition" />
        </div> }

            <button
                onClick={() => {setIsEditing(true);
                }}
                className="bg-blue-500 text-white px-3 py-1 rounded">
                Add Section
            </button>
      </div>

      {open && (
        <div className="bg-gray-900 px-6 py-3 space-y-2 text-gray-300">
          {children}
        </div>
      )}

      {isEditing && 
          <form onSubmit={EditTheSection} className="p-4 bg-gray-100 rounded-md mt-4">
              <h4 className="font-bold mb-2">Editing: {istitle}</h4>
              <label htmlFor="edit-title">Title:</label>
              <input 
                  type="text" 
                  id='edit-title' 
                  value={istitle} 
                  onChange={(e) => setIstitle(e.target.value)}
                  className='border px-2 py-1 mr-3'
              />

              <label htmlFor="edit-duration">Subtitle:</label>
              <input 
                  type="text" 
                  id='edit-duration' 
                  value={isSubtitle} 
                  onChange={(e) => setIsSubtitle(e.target.value)} 
                  className='border px-2 py-1 mr-3'
              />

              <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
                  <FiSave /> Save
              </button>
              <button type="button" onClick={() => {setIsEditing(false)}} className="bg-gray-300 ml-2 px-3 py-1 rounded">
                  Cancel
              </button>
          </form>
      }
    </div>
  );
}

export default Dropdown 