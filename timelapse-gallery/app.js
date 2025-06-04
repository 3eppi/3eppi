const { useState, useEffect, useRef } = React;

function Sidebar({ cameras, selected, onSelect, onAdd, slideshow, setSlideshow }) {
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [intervalSec, setIntervalSec] = useState(5);

  const addCamera = () => {
    if (!newName || !newUrl) return;
    onAdd({ name: newName, url: newUrl, status: 'Live' });
    setNewName('');
    setNewUrl('');
  };

  return (
    <div className="w-64 bg-black text-white p-4 flex flex-col space-y-4 h-full overflow-y-auto">
      <h1 className="text-xl font-bold">Cameras</h1>
      <div className="flex-1 space-y-2">
        {cameras.map((cam, idx) => (
          <div
            key={idx}
            className={`p-2 rounded cursor-pointer ${selected === idx ? 'bg-gray-700' : 'bg-gray-900'}`}
            onClick={() => onSelect(idx)}
          >
            {cam.name}
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <h2 className="font-semibold">Add Camera</h2>
        <input className="w-full p-1 text-black" placeholder="Name" value={newName} onChange={e => setNewName(e.target.value)} />
        <input className="w-full p-1 text-black" placeholder="URL" value={newUrl} onChange={e => setNewUrl(e.target.value)} />
        <button className="w-full bg-blue-600 p-1 rounded" onClick={addCamera}>Add</button>
      </div>
      <div className="space-y-2 border-t border-gray-600 pt-2">
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={slideshow} onChange={e => setSlideshow(e.target.checked)} />
          <span>Slideshow Mode</span>
        </label>
        <input
          type="number"
          className="w-full p-1 text-black"
          value={intervalSec}
          onChange={e => setIntervalSec(parseInt(e.target.value) || 1)}
        />
      </div>
    </div>
  );
}

function CameraGrid({ cameras, selected, onDelete }) {
  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 overflow-auto">
      {cameras.map((cam, idx) => (
        <div key={idx} className="rounded shadow bg-white relative">
          <div className="p-2 font-semibold bg-gray-800 text-white rounded-t">{cam.name}</div>
          <div className="p-2">
            <img src={cam.url} alt={cam.name} className="w-full h-48 object-cover" />
          </div>
          <div className="absolute top-1 right-1 space-x-1">
            <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => onDelete(idx)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function App() {
  const [cameras, setCameras] = useState([]);
  const [selected, setSelected] = useState(null);
  const [slideshow, setSlideshow] = useState(false);
  const slideshowRef = useRef(null);

  useEffect(() => {
    if (slideshow) {
      slideshowRef.current = setInterval(() => {
        setSelected(prev => (prev === null ? 0 : (prev + 1) % cameras.length));
      }, 5000);
    } else {
      clearInterval(slideshowRef.current);
    }
    return () => clearInterval(slideshowRef.current);
  }, [slideshow, cameras]);

  const addCamera = cam => setCameras([...cameras, cam]);
  const deleteCamera = idx => setCameras(cameras.filter((_, i) => i !== idx));

  return (
    <div className="flex h-full">
      <Sidebar
        cameras={cameras}
        selected={selected}
        onSelect={setSelected}
        onAdd={addCamera}
        slideshow={slideshow}
        setSlideshow={setSlideshow}
      />
      <CameraGrid cameras={selected !== null ? [cameras[selected]] : cameras} selected={selected} onDelete={deleteCamera} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
