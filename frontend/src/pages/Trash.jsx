import React from 'react'
import bin from "../assets/Bin.png"

const Trash = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen '>
       <img src={bin} alt="bin image" className='w-50 h-50 mb-3'/>
       <h2><b>No files or folders on the trash</b></h2>
       <p className=''>Move files you don't need any more to the <b>Trash</b>. Click empty trash from the trash menu to permenantly delete items and free up storage space</p>
       <p></p>
      
    </div>
  )
}

export default Trash
