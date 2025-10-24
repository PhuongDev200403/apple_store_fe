import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getAllSeries } from '../../utils/api/categoryApi.js';

export default function CategoryPage() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    getAllSeries(slug).then(setGroups).catch(() => setGroups([]));
  }, [slug, params]);

  return (
    <div className="container">
      <h1>Danh mục: {slug}</h1>
      <div className="series-grid">
        {groups.map((g) => (
          <div key={g.title} className="series-group">
            <h3>{g.title}</h3>
            <ul>
              {(g.items || g.children || []).map((item) => (
                <li key={item.slug || item.id}>{item.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

