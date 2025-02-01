// LayersPanel.jsx
import "./styles/layerspanel.css";
import { useDispatch, useSelector } from "react-redux";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { BiLayer, BiLayerPlus } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { addLayer, deleteLayer, toggleLayerVisibility, setActiveLayer } from "../app/features/toolSlice";
import { RootState } from "../app/store";

const LayersPanel = () => {
  const dispatch = useDispatch();
  const { layers, activeLayerId } = useSelector((state: RootState) => state.tool);

  return (
    <div className='layers-panel'>
      <p>
        Layers{" "}
        <span>
          <BiLayer />
        </span>
      </p>
      <button onClick={() => dispatch(addLayer())}>
        <BiLayerPlus size={25} />
      </button>
      <ul>
        {[...layers].reverse().map((layer) => (
          <li key={layer.id} className={layer.id === activeLayerId ? "active-layer" : ""} onClick={() => dispatch(setActiveLayer(layer.id))}>
            <div className='layer-eye-txt'>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(toggleLayerVisibility(layer.id));
                }}
                className='eye-button'
              >
                {layer.isVisible ? <IoMdEye /> : <IoMdEyeOff />}
              </button>
              <p>{layer.name}</p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch(deleteLayer(layer.id));
              }}
              className='delete-button'
            >
              <span>
                <MdDelete />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LayersPanel;
