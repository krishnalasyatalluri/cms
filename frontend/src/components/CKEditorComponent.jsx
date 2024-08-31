import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FontColor } from '@ckeditor/ckeditor5-font';

// Import necessary styles


const CKEditorComponent = ({ data, onChange }) => {
    return (
        <CKEditor
            editor={ClassicEditor}
            data={data}
            config={{
                toolbar: {
                    items: [
                        'undo', 'redo', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote','fontColor'
                    ],
                },
                language: 'en', // Change to your desired language
                placeholder: 'Type your content here...',
            }}
            onChange={(event, editor) => {
                const data = editor.getData();
                onChange(data);
            }}
        />
    );
};

export default CKEditorComponent;
