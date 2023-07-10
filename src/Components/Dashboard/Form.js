import React, { useState } from 'react';
import styles from './Dashboard.module.css'
import { Button, notification, Space } from 'antd';

export default function Form() {
    const [api, contextHolder] = notification.useNotification();
    const [formData, setFormData] = useState(new FormData());





    const openNotificationWithIcon = (type,msg,des) => {
        api[type]({
            message: msg,
            description:des
        });
    };
    const handleDropdownChange = (e) => {
        const { name, value } = e.target;
        formData.set(name, value);
      };

      const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        const value = checked ? 'yes' : 'no';
        formData.set(name, value);
      };

    const handleSubmit = (event) => {
        event.preventDefault();
    
        console.log([...formData.entries()]);
        fetch('https://localhost:7248/api/fileupload/Called', {
          method: 'POST',
          headers: {
             //"Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE",
            
          },
          body: formData,
        })
        .then((response) => {
          if (response.ok) {
            // File uploaded successfully
            return response.json(); // Parse the response body as JSON
          } else {
            // Error uploading file
            throw new Error('Error uploading file');
          }
        })
        .then((data) => {
          // Access the response data
          console.log(data);
          if (data.error == false){
            console.log('File uploaded successfully');
            openNotificationWithIcon('success','File uploaded successfully',data.status)
          }
          else{
            openNotificationWithIcon('error','Error uploading file',data.status)
            console.log('Error occured.');
          }
        })
        .catch((error) => {
          if (error == "TypeError: Failed to fetch"){
            openNotificationWithIcon('error','Server error','Server is not running up.')
          }
          console.error('Error uploading file jjj:', error);
        });
      };
    return (
        <div className='container'>
            {contextHolder}
            <form>
                <div className='row'>
                    <div className='col-4 p-2'>
                        <div className="form-group">
                            <label htmlFor="exampleInputFileName" className='p-2'>Filename</label>
                            <input type="text" onChange={(e) => formData.set('fileName', e.target.value)} className="form-control" id="exampleInputFileName" placeholder="Enter file name..." />
                        </div>
                    </div>
                    <div className='col-4 p-2'>
                        <div className="form-group">
                            <label htmlFor="exampleInputSourcePath" className='p-2'>Source Path</label>
                            <input type="text" onChange={(e) => formData.set('sourcepath', e.target.value)} className="form-control" id="exampleInputSourcePath" placeholder="Enter source path..." />
                        </div>
                    </div>
                    <div className='col-4 p-2'>
                        <div className="form-group">
                            <label htmlFor="exampleInputDestinationPath" className='p-2'>Dest Path</label>
                            <input type="text" onChange={(e) => formData.set('destinationpath', e.target.value)}  className="form-control" id="exampleInputDestinationPath" placeholder="Enter destination path..." />
                        </div>
                    </div>
                </div>
                <hr />
                <div className='row'>
                    <div className='col-4'>
                        <select onChange={handleDropdownChange} name="fileType" className="custom-select btn" style={{ "marginTop": "45px" }}>
                            <option value=".csv" defaultValue>file type</option>
                            <option value="1">.csv</option>
                            <option value="2">.pdf</option>
                            <option value="3">.docs</option>
                        </select>
                    </div>

                    <div className='col-4'>
                        <div className="form-group">
                            <select onChange={handleDropdownChange} name="delimiter" className="custom-select btn" style={{ "marginTop": "45px" }}>
                                <option defaultValue value=",">Delimiter</option>
                                <option value=",">,</option>
                                <option value=";">;</option>
                                <option value="/">/</option>
                            </select>
                        </div>
                    </div>
                    <div className='col-4'>
                        <div className="form-group">
                            <label htmlFor="exampleInputVendorName" className='p-2'>Vendor Name</label>
                            <input onChange={(e) => formData.set('vendorname', e.target.value)} type="text" className="form-control" id="exampleInputVendorName" placeholder="Enter vendor name..." />
                        </div>
                    </div>
                </div>
                <hr />
                <div className='row'>
                    <div className='col-4'>
                        <div className="form-group">
                            <label htmlFor="exampleInputTemplateFile" className='p-2'>Template File</label>
                            <input onChange={(e) => formData.set('templatefile', e.target.files[0])} type="file" className="form-control" id="exampleInputTemplateDownload" />
                        </div>
                    </div>
                    <div className='col-4'>
                        <div className="form-group">
                            <label htmlFor="exampleInputTemplateUpload" className='p-2'>Sample File</label>
                            <input onChange={(e) => formData.set('samplefile', e.target.files[0])} type="file" className="form-control" id="exampleInputTemplateUpload" />
                        </div>
                    </div>
                    <div className='col-4'>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail" className='p-2'>Email</label>
                            <input onChange={(e) => formData.set('email', e.target.value)} type="text" className="form-control" id="exampleInputEmail" placeholder="Enter email..." />
                        </div>
                    </div>
                </div>
                <hr />
                <div className='row'>
                    <div className='col-4'>
                        <div className="form-check" style={{"display":"table"}}>
                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                SLA Alert
                            </label>
                            <input onChange={handleCheckboxChange} name="slaAlert" className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                        </div>
                        <div>
                        </div>
                    </div>
                    <div className='col-4' style={{"marginTop":"-50px"}}>
                        <div className='form-group'>
                            <select onChange={(e) => formData.set('linefeed', e.target.value)} className="custom-select btn" style={{ "marginTop": "45px" }}>
                                <option defaultValue value=",">Linefeed</option>
                                <option value=",">----</option>
                                <option value=";">----</option>
                                <option value="/">----</option>
                            </select>
                        </div>
                    </div>
                </div>
                <hr />
                <div className='row'>
                    <div className='col-4'>

                    </div>
                    <div className='col-4 p-2'>
                        <button className='btn btn-primary' onClick={handleSubmit}>Submit</button>
                        &nbsp;&nbsp;
                        <input type='reset' className='btn btn-primary' />
                    </div>
                    <div className='col-4'>

                    </div>


                </div>
            </form>
        </div>
    )
}