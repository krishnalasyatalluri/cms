import React, { useState, useEffect } from 'react';
import './Component.css';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';

const ProjectComponentsPage = () => {
    const { projectId } = useParams();
    const [components, setComponents] = useState([]);
    const [projectName, setProjectName] = useState(''); // Ensure projectName is set if needed
    const [editorData, setEditorData] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchComponents = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/component/${projectId}`);
                console.log(response.data)
                if (response.data && response.data.components) {
                    setComponents(response.data.components);
                } else {
                    console.error('Expected response data to have a "components" array:', response.data);
                }
            } catch (error) {
                console.error('Error fetching components:', error);
            }
        };

        fetchComponents();
    }, [projectId]);

    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setEditorData(data);
    };

    const handleCreateComponent = async () => {
        if (!editorData.trim()) {
            alert('Component content cannot be empty.');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5000/api/component/create/${projectId}`, {
                name: editorData,
                htmlContent: editorData
            });
            console.log('Component created:', response.data);

            const updatedComponentsResponse = await axios.get(`http://localhost:5000/api/component/${projectId}`);
            setComponents(updatedComponentsResponse.data.components);

            setEditorData('');
        } catch (error) {
            console.error('Error creating component:', error);
        }
    };

    const handleComponentSelect = (componentId) => {
        navigate(`/project/${projectId}/component/${componentId}/subcomponents`);
    };
    const stripHtmlTags = (html) => {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    };
    return (
        <div>
            <div className="project-components-page">
                <div>
                    <h2>{projectName} Components Creation</h2>

                    <div className="editor-container">
                        <CKEditor
                            editor={ClassicEditor}
                            data={editorData}
                            onChange={handleEditorChange}
                            config={{
                                toolbar: {
                                    items: [
                                        'heading', '|',
                                        'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
                                        'undo', 'redo'
                                    ],
                                },
                            }}
                        />
                        <button className="create-component-button" onClick={handleCreateComponent}>Create Component</button>
                    </div>
                </div>

                <div>


                    <h3>Components</h3>
                    {/* <ul className="components-list">
                        {components.length > 0 ? (
                            components.map((component) => (
                                <li key={component._id} onClick={() => handleComponentSelect(component._id)}>
                                    {component.name}
                                </li>
                            ))
                        ) : (
                            <p className="no-components">No components available for this project</p>
                        )}
                    </ul> */}
                    <ul className="components-list">
                        {components.length > 0 ? (
                            components.map((component) => (
                                <li key={component._id} onClick={() => handleComponentSelect(component._id)}>
                                    <div dangerouslySetInnerHTML={{ __html: stripHtmlTags(component.name) }} />
                                </li>
                            ))
                        ) : (
                            <p className="no-components">No components available for this project</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ProjectComponentsPage;
