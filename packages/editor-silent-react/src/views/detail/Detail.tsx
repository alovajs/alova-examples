import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useLocation } from 'react-router-dom';
import { useSQRequest } from '@alova/scene-react';
import { noteDetail } from '../../common/api';

const Detail = () => {
  const { search } = useLocation();
  const urlParams = new URLSearchParams(search);
  const currentId = urlParams.get('id') || '';
  const { data: detail, update } = useSQRequest(() => noteDetail(currentId), {
    immediate: !!currentId,
    initialData: {
      content: ''
    }
  });


  return (
    <div>
      <ReactQuill theme="snow" value={detail.content} onChange={(val: string) => {
        update({
          data: {
            ...detail,
            content: val,
          }
        })
      }} />
    </div>
  )
};

export default Detail;