import React, { useState, useEffect } from 'react';
import styles from './Form.module.css'
import { Button, notification, Space } from 'antd';
import { isEmail } from 'validator';
import loadingImage from '../../images/loading.gif';
import downloadTemplateFile from '../../files/template_file.csv'
import downloadFixedLengthTemplateFile from '../../files/fixed_length_template_file.csv'

import { pathConfiguration } from '../../utility/StaticDetails';
import ProgressPage from './ProgressPage';




export default function Form() {
    const [api, contextHolder] = notification.useNotification();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(new FormData());
    const [fileName, setFileName] = useState("");
    const [vendorName, setVendorName] = useState("");
    let sourcepath = pathConfiguration.sourcepathprefix + `${vendorName}/${fileName}` + pathConfiguration.sourcepathsufix;
    let destinationpath = pathConfiguration.destinationpathprefix + `${vendorName}/${fileName}`;
    const [FixedLength, setFixedLength] = useState(false);
    const [IsActive, setIsActive] = useState(true);
    const [delimiterData, setDelimiterData] = useState([]);

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
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        formData.set('templatefile', file)

    }
    function validateEmail(emailid) {
        if (emailid === "") {
            return false;
        }
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(emailid);

    }

    const dropdownOptions = ()=>{
        fetch('https://localhost:7116/api/Data/GetDelimiters', {
                method: 'GET',
                headers: {
                    // "Content-Type": "multipart/form-data",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE",
                },
                // body: formData,

            })
                .then((response) => {
                    if (response.ok) {
                        // File uploaded successfully
                        return response.json(); // Parse the response body as JSON
                    } else {

                        throw new Error('Error fetching dropdownoptions');
                    }
                })
                .then((data) => {
                    // setFormData(new FormData());
                    // Access the response data
                    console.log(data);
                    if (data) {
                        setLoading(false);
                        setDelimiterData(data);
                        console.log('Fetched successfully');
                    }
                    else {
                        openNotificationWithIcon('error', 'Error fetching dropdownoptions', data.status)
                    }
                })
                .catch((error) => {
                    if (error == "TypeError: Failed to fetch") {
                        setLoading(false);
                        openNotificationWithIcon('error', 'Server error', 'Server is not running up.')
                    } 
                });
    }

    useEffect(()=>{
        //Runs only on the first render
        dropdownOptions();

    },[])

    const handleSubmit = (event) => {
        event.preventDefault();

        formData.set('sourcepath', sourcepath);
        formData.set('destinationpath', destinationpath);
        formData.set('filename', fileName);
        formData.set('vendorname', vendorName);
        formData.set('fixedlength', FixedLength);
        formData.set('isactive', IsActive);
        let email = formData.get('emailid');
        setLoading(true);

        if (!validateEmail(email)) {
            setLoading(false);
            openNotificationWithIcon('error', 'try agian', 'Please enter a valid email.')
        }
        else {
            console.log("come here");
            console.log([...formData.entries()]);
            fetch('https://localhost:7116/api/file/UploadFile', {
                method: 'POST',
                headers: {
                    // "Content-Type": "multipart/form-data",
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

                        throw new Error('Error uploading file');
                    }
                })
                .then((data) => {
                    // setFormData(new FormData());
                    // Access the response data
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
                    sourcepath = "";
                    destinationpath = "";
                    setFileName("");
                    setVendorName("");
                    setFixedLength(false);
                    // setIsActive(false);
                    // console.log([...formData.entries()]);
                    console.log("null ho gyi");
                    if (error == "TypeError: Failed to fetch") {
                        setLoading(false);
                        openNotificationWithIcon('error', 'Server error', 'Server is not running up.')
                    } else {
                        setLoading(false);
                        openNotificationWithIcon('error', 'Error uploading file', error.message.toString())
                        console.error('Error uploading file jjj:', error.message.toString());
                    }
                });
        };

    }

    const delimiterOptions = delimiterData.map((data,i) => {
        return(
            <option key={i} value={data.id}>{data.name} {data.description}</option>
        )
    })



    return (
        <div className='container'>
            {contextHolder}
            {
                loading ? <ProgressPage /> : <>
                    <form>
                        <div className='row p-3'>
                            <div className='col-4 p-2'>
                                <div className={"form-group" + " " + styles.colDisplay}>
                                    <label htmlFor="exampleInputFileName" className={"p-2" + " " + styles.labelDark}>Filename</label>
                                    <input type="text" required onChange={(e) => setFileName(e.target.value)} className="form-control" id="exampleInputFileName" placeholder="Enter file name..." />
                                </div>
                            </div>

                            <div className='col-4 p-2'>
                                <div className={"form-group" + " " + styles.colDisplay}>

                                    <label className={"p-2" + " " + styles.labelDark}>FileDate</label>
                                    {/* &nbsp;&nbsp;&nbsp;&nbsp; */}
                                    <br />
                                    <select required onChange={handleDropdownChange} name="filedate" className={"custom-select btn" + " " + styles.dropdownInput} >
                                        <option defaultValue>Select</option>
                                        <option value="1">Header</option>
                                        <option value="2">Footer</option>
                                        <option value="3">FileName</option>
                                        <option value="4">CurrentDate</option>
                                    </select>
                                </div>
                            </div>
                           
                            <div className='col-4 p-2' >
                                <div className={"form-group" + " " + styles.colDisplay}>

                                    <label className={"p-2" + " " + styles.labelDark}>Vendor Name</label>
                                    {/* &nbsp;&nbsp;&nbsp;&nbsp; */}
                                    <br />
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
                            <div className={'col-4 p-2'}>
                                <div className={"form-group" + " " + styles.colDisplay} >
                                    <label className={"p-2" + " " + styles.labelDark}>Source Path</label>
                                    <input type="text" readOnly value={sourcepath} className={styles.disableInput + " " + "form-control"} id="exampleInputSourcePath" placeholder="Enter source path..." />

                                </div>

                            </div>
                            <div className={'col-4 p-2'}>
                                <div className={"form-group" + " " + styles.colDisplay}>
                                    <label className={"p-2" + " " + styles.labelDark}>Destination Path</label>
                                    <input type="text" readOnly value={destinationpath} className={styles.disableInput + " " + "form-control"} id="exampleInputDestinationPath" placeholder="Enter destination path..." />
                                </div>
                            </div>
                            <div className='col-4 p-2'>
                                <div className={"form-group" + " " + styles.colDisplay}>
                                    <label className={"p-2" + " " + styles.labelDark}>Allowed File</label>
                                    {/* &nbsp;&nbsp;&nbsp;&nbsp; */}
                                    <br />
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
                            <div className='col-4 p-2'>
                                <div className={"form-group" + " " + styles.colDisplay}>
                                    <label htmlFor="exampleInputDbnotebook" className={"p-2" + " " + styles.labelDark}>DBNotebook</label>
                                    <input type="text" onChange={(e) => formData.set('dbnotebook', e.target.value)} className="form-control" id="exampleInputDbnotebook" placeholder="Enter dbnotebook name..." />
                                </div>
                            </div>



                            <div className='col-4 p-2'>
                                <div className={"form-group" + " " + styles.colDisplay}>
                                    <label className={"p-2" + " " + styles.labelDark}>Insertion Mode</label>
                                    {/* &nbsp;&nbsp;&nbsp;&nbsp; */}
                                    <br />
                                    <select onChange={handleDropdownChange} name="insertionmode" className={"custom-select btn" + " " + styles.dropdownInput} >
                                        <option defaultValue>Select</option>
                                        <option value="Append">Append</option>
                                        <option value="Overwrite">Overwrite</option>
                                    </select>
                                </div>
                            </div>
                            <div className='col-4 p-2 '  >
                                <div className={"form-group" + " " + styles.colDisplay}>
                                    <label className={"p-2" + " " + styles.labelDark}>Delimiter</label>
                                    {/* &nbsp;&nbsp;&nbsp;&nbsp; */}
                                    <br />
                                    <select onChange={handleDropdownChange} name="delimiter" className={"custom-select btn" + " " + styles.dropdownInput} >
                                        <option defaultValue>Select</option>
                                        {/* <option value="1">;</option>
                                        <option value="2">t</option>
                                        <option value="3">,</option>
                                        <option value="4">|</option>
                                        <option value="5">:</option> */}
                                        {delimiterOptions}
                                    </select>
                                </div>
                            </div>

                        </div>
                        <hr />
                        <div className='row p-3'>
                            <div className={'col-4 p-2'}>
                                <div className={"form-group" + " " + styles.colDisplay}>
                                    <label className={"p-2 form-check-label" + " " + styles.labelDark} htmlFor="flexCheckDefault">
                                        FixedLength
                                    </label>

                                    <input onChange={(e) => { setFixedLength(e.target.checked); }} checked={FixedLength} className={styles.checkBox+ " "+ styles.checkboxiconFixedlength} name="fixedlength" type="checkbox" />
                                </div>
                            </div>
                            <div className={'col-4 p-2'}>
                                <div className={"form-group" + " " + styles.colDisplay}>
                                    <label className={"p-2" + " " + styles.labelDark}>Download template file</label><br /><a className={styles.downloadFileIcon+ " "+ styles.checkboxiconDownload} href={FixedLength ? downloadFixedLengthTemplateFile : downloadTemplateFile} download={FixedLength ? "Fixed length template file" : "Template file"} target='_blank' rel='noreferrer'><i className="bi bi-cloud-arrow-down-fill"></i></a>
                                </div>

                            </div>
                            <div className={'col-4 p-2'}>
                                <div className={"form-group" + " " + styles.colDisplay}>

                                    <label htmlFor="exampleInputTemplateFile" className={"p-2" + " " + styles.labelDark}>Template File</label>
                                    <input onChange={handleFileChange} type="file" className={"form-control"+" "+styles.selectFileInput} id="exampleInputTemplateDownload" />
                                </div>
                            </div>


                        </div>
                        <hr />
                        <div className='row p-3'>

                            <div className={'col-4 p-2'}>
                                <div className={"form-group" + " " + styles.colDisplay}>
                                    <label className={"p-2 form-check-label" + " " + styles.labelDark} htmlFor="flexCheckDefault">
                                        Is Active
                                    </label>
                                    <input onChange={(e) => { setIsActive(e.target.checked); }} checked={IsActive} disabled name="IsActive" className={styles.checkBox+ " "+ styles.checkboxiconIsactive} type="checkbox" />
                                </div>

                            </div>
                            <div className={'col-4 p-2'}>
                                <div className={"form-group" + " " + styles.colDisplay}>
                                    <label htmlFor="exampleInputTemplateUpload" className={"p-2" + " " + styles.labelDark}>Sample File</label>
                                    <input onChange={(e) => formData.set('samplefile', e.target.files[0])} type="file" className={"form-control"+" "+styles.selectFileInput} id="exampleInputTemplateUpload" />
                                </div>
                            </div>
                            

                            <div className='col-4 p-2'>
                                <div className={"form-group" + " " + styles.colDisplay}>
                                    <label htmlFor="exampleInputEmail" className={"p-2" + " " + styles.labelDark}>Email</label>
                                    <input onChange={(e) => formData.set('emailid', e.target.value)} type="email" className="form-control" id="exampleInputEmail" placeholder="Enter email..." />
                                </div>

                            </div>
                        </div>
                        <hr />
                        <div className='row p-3'>
                            <div className='col-4 p-2'>

                            </div>
                            <div className='col-4 p-2'>
                                <button className={"btn text-light" + " " + styles.buttonBgColor} onClick={handleSubmit}>{loading ? "Submitting..." : "Submit"}</button>
                                &nbsp;&nbsp;
                                <input type='reset' className={"btn text-light" + " " + styles.buttonBgColor} />
                            </div>
                            <div className='col-4 p-2'>

                            </div>
                        </div>
                    </form>
                </>
            }

        </div>
    )
}