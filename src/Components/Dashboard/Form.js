import React, { useState } from 'react';
import styles from './Form.module.css'
import { Button, notification, Space } from 'antd';
import { isEmail } from 'validator';
import loadingImage from '../../images/loading.gif';
import downloadTemplateFile from '../../files/template_file.csv'

import { pathConfiguration } from '../../utility/StaticDetails';
import ProgressPage from './ProgressPage';



export default function Form() {
    const [api, contextHolder] = notification.useNotification();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(new FormData());
    const [fileName, setFileName] = useState("");
    const [vendorName, setVendorName] = useState("");
    const [destinationPath, setDestinationPath] = useState("");
    let sourcepath = pathConfiguration.sourcepathprefix +`${fileName}/${vendorName}`+ pathConfiguration.sourcepathsufix;
    let destinationpath = pathConfiguration.destinationpathprefix+`${vendorName}/${fileName}`;
    console.log(sourcepath);



    const openNotificationWithIcon = (type, msg, des) => {
        api[type]({
            message: msg,
            description: des
        });
    };
    const handleDropdownChange = (e) => {
        const { name, value } = e.target;
        formData.set(name, value);
    };
    const handleDropdownChange1 = (e) => {
        const { name, value } = e.target;
        setVendorName(value);

        
        // let temp = formData.get('fileName');
        // temp = value + "/"+ temp;
        // console.log(temp);
        // const sourcepath = pathConfiguration.sourcepathprefix + temp+pathConfiguration.sourcepathsufix;
        // setSourcePath(sourcepath);
        // formData.set('sourcepath', sourcepath);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        formData.set('templatefile', file)
        // const sourcepath = pathConfiguration.sourcepathprefix + "";
        // const destinationpath = pathConfiguration.destinationPath + file.name;
        // setSourcePath(sourcepath);
        // setDestinationPath(destinationpath);
        // formData.set('sourcepath', sourcepath);
        // formData.set('destinationpath', sourcepath);
    }

    function validateEmail(emailid) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(emailid);

    }

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        const value = checked ? 'yes' : 'no';
        formData.set(name, value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        formData.set('sourcepath',sourcepath);
        formData.set('destinationpath',destinationpath);
        formData.set('filename',fileName);
        formData.set('vendorname',vendorName);
        setLoading(true);
        console.log([...formData.entries()]);
        const email = formData.get('emailid');
        console.log(email);
        console.log(validateEmail(email));
        if (!validateEmail(email)) {
            setLoading(false);
            openNotificationWithIcon('error', 'Email not valid', 'please enter a valid email to proceed further...')
        }
        else {
            fetch('https://localhost:7116/api/file/UploadFile', {
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
                        // document.getElementById("myForm").reset();
                        // Error uploading file
                        throw new Error('Error uploading file');
                    }
                })
                .then((data) => {
                    // Access the response data
                    console.log("yha");
                    setFormData(new FormData());
                    console.log([...formData.entries()]);
                    console.log("null ho gyi");
                    // document.getElementById("myForm").reset();
                    if (data.error == false) {
                        setLoading(false);
                        console.log('File uploaded successfully');
                        openNotificationWithIcon('success', 'File uploaded successfully', data.status)
                    }
                    else {
                        setLoading(false);
                        openNotificationWithIcon('error', 'Error uploading file', data.status)
                        console.log('Error occured.');
                    }
                })
                .catch((error) => {
                    console.log("yhaaaa");
                    formData.forEach((value, key) => {
                        formData.delete(key);
                      });
                      sourcepath="";
                      destinationpath = "";
                      setFileName("");
                      setVendorName("");
                    console.log([...formData.entries()]);
                    console.log("null ho gyi");
                    if (error == "TypeError: Failed to fetch") {
                        setLoading(false);
                        // setSourcePath("");
                        setDestinationPath("");
                        openNotificationWithIcon('error', 'Server error', 'Server is not running up.')
                    } else {
                        setLoading(false);
                        openNotificationWithIcon('error', 'Error uploading file', error.message.toString())
                    }
                    // setFormData(new FormData());
                    console.error('Error uploading file jjj:', error);
                });
        };

    }



    return (
        <div className='container'>
            {contextHolder}
            {
                loading ? <ProgressPage /> : <>
                    <form>
                        <div className='row p-3'>
                            <div className='col-4 p-4'>
                                <div className={"form-group" + " " + styles.colDisplay}>
                                    <label htmlFor="exampleInputFileName" className={"p-2" + " " + styles.labelDark}>Filename</label>
                                    <input type="text" onChange={(e) => setFileName(e.target.value)} className="form-control" id="exampleInputFileName" placeholder="Enter file name..." />
                                </div>
                            </div>

                            <div className='col-4 p-4'>
                                <div className={"form-group" + " " + styles.colDisplay}>
                                    <label htmlFor="exampleInputEmail" className={"p-2" + " " + styles.labelDark}>Email</label>
                                    <input onChange={(e) => formData.set('emailid', e.target.value)} type="email" className="form-control" id="exampleInputEmail" placeholder="Enter email..." />
                                </div>
                            </div>
                            <div className='col-4 p-4' >
                                <div className={"form-group" + " " + styles.colDisplay}>
                                    
                                <label className={"p-2" + " " + styles.labelDark}>Vendor Name</label>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <select required onChange={handleDropdownChange1} name="vendorname" className={"custom-select btn" + " " + styles.dropdownInput} >
                                    <option defaultValue>Select</option>
                                    <option value="BlackDiamond">BlackDiamond</option>
                                    <option value="Bloomberg">Bloomberg</option>
                                    <option value="CIBC">CIBC</option>
                                    <option value="Fidelity">Fidelity</option>
                                    <option value="Pershing">Pershing</option>
                                </select>
                                </div>
                            </div>
                            <div className={'col-4 p-4'}>
                                <div className={"form-group"+ " " + styles.colDisplay} >
                                <label htmlFor="exampleInputSourcePath" className={styles.labelDark}>Source Path</label>
                                    <input type="text" readOnly value={sourcepath} className={styles.disableInput + " " + "form-control"} id="exampleInputSourcePath" placeholder="Enter source path..." />

                                </div>
                            </div>
                            <div className={'col-4 p-4'}>
                                <div className={"form-group"+ " " + styles.colDisplay}>
                                <label htmlFor="exampleInputDestinationPath" className={styles.labelDark}>Destination Path</label>
                                    <input type="text" readOnly value={destinationpath} className={styles.disableInput + " " + "form-control"} id="exampleInputDestinationPath" placeholder="Enter destination path..." />
                                </div>
                            </div>
                            <div className='col-4 p-4'>
                            <div className={"form-group" + " " + styles.colDisplay}>
                                <label className={"p-2" + " " + styles.labelDark}>Allowed File</label>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <select required onChange={handleDropdownChange} name="fileType" className={"custom-select btn" + " " + styles.dropdownInput} >
                                    <option defaultValue>Select</option>
                                    <option value="1">.csv</option>
                                    <option value="2">.pdf</option>
                                    <option value="3">.docs</option>
                                </select>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className='row p-3'>
                            <div className='col-4 p-4'>
                                <div className={"form-group" + " " + styles.colDisplay}>
                                    <label htmlFor="exampleInputDbnotebook" className={"p-2" + " " + styles.labelDark}>DBNotebook</label>
                                    <input type="text" onChange={(e) => formData.set('dbnotebook', e.target.value)} className="form-control" id="exampleInputDbnotebook" placeholder="Enter dbnotebook name..." />
                                </div>
                            </div>



                            <div className='col-4 p-4'>
                            <div className={"form-group" + " " + styles.colDisplay}>
                                <label className={"p-2" + " " + styles.labelDark}>Insertion Mode</label>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <select onChange={handleDropdownChange} name="insertionmode" className={"custom-select btn" + " " + styles.dropdownInput} >
                                    <option defaultValue>Select</option>
                                    <option value="Append">Append</option>
                                    <option value="Overwrite">Overwrite</option>
                                </select>
                                </div>
                            </div>
                            <div className='col-4 p-4 '  >
                            <div className={"form-group" + " " + styles.colDisplay}>
                                <label className={"p-2" + " " + styles.labelDark}>Delimiter</label>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <select onChange={handleDropdownChange} name="delimiter" className={"custom-select btn" + " " + styles.dropdownInput} >
                                    <option defaultValue>Select</option>
                                    <option value=",">,</option>
                                    <option value=";">;</option>
                                    <option value="/">/</option>
                                </select>
                                </div>
                            </div>

                        </div>
                        <hr />
                        <div className='row p-3'>
                            <div className={'col-4 p-4'}>
                            <div className={"form-group" + " " + styles.colDisplay}>
                                <label className={"p-2 form-check-label" + " " + styles.labelDark} htmlFor="flexCheckDefault">
                                    FixedLength
                                </label>

                                <input onChange={handleCheckboxChange} className={styles.checkBox} name="fixedlength" type="checkbox" id="flexCheckDefault" />
                            </div>
                            </div>
                            <div className={'col-4 p-4'}>
                            <div className={"form-group" + " " + styles.colDisplay}>
                                <label className={"p-2" + " " + styles.labelDark}>Download template file</label>&nbsp;&nbsp;<a className={styles.downloadFileIcon} href={downloadTemplateFile} download="Template file" target='_blank' rel='noreferrer'><i className="bi bi-cloud-arrow-down-fill"></i></a>
                            </div>
                            </div>
                            <div className={'col-4 p-4'}>
                            <div className={"form-group" + " " + styles.colDisplay}>

                                <label htmlFor="exampleInputTemplateFile" className={"p-2" + " " + styles.labelDark}>Template File</label>
                                    <input onChange={handleFileChange} type="file" className="form-control" id="exampleInputTemplateDownload" />
                                </div>
                            </div>


                        </div>
                        <hr />
                        <div className='row p-3'>

                            <div className={'col-4 p-4'}>
                            <div className={"form-group" + " " + styles.colDisplay}>
                                <label className={"p-2 form-check-label" + " " + styles.labelDark} htmlFor="flexCheckDefault">
                                    SLA Alert
                                </label>
                                <input onChange={handleCheckboxChange} name="slaAlert" className={styles.checkBox} type="checkbox" id="flexCheckDefault" />
                            </div>

                            </div>
                            <div className={'col-4 p-4'}>
                            <div className={"form-group" + " " + styles.colDisplay}>
                                <label htmlFor="exampleInputTemplateUpload" className={"p-2" + " " + styles.labelDark}>Sample File</label>
                                    <input onChange={(e) => formData.set('samplefile', e.target.files[0])} type="file" className="form-control" id="exampleInputTemplateUpload" />
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className='row p-3'>
                            <div className='col-4 p-4'>

                            </div>
                            <div className='col-4 p-4'>
                                <button className={"btn text-light" + " " + styles.buttonBgColor} onClick={handleSubmit}>{loading ? "Submitting..." : "Submit"}</button>
                                &nbsp;&nbsp;
                                <input type='reset' className={"btn text-light" + " " + styles.buttonBgColor} />
                            </div>
                            <div className='col-4 p-4'>

                            </div>


                        </div>
                    </form>
                </>
            }

        </div>
    )
}