
import { Link } from 'react-router-dom';

import Badge from 'react-bootstrap/Badge';

export default function WidgetsList({ data, ...rest }) {
  return (
    <div {...rest}>
      <ul className="list-group" style={{ minHeight: '14rem' }}>
        {data.rows.map((row, i) => (
          <li className="list-group-item" key={row.id}>
            <Link to={`/widget/${row.id}`}>view</Link>{' '}
            {row.value.label}
            <Badge
              bg={row.value.status === 'inactive' ? 'danger' : 'success'}
              className="ms-1"
            >
              {row.value.status}
            </Badge>
            {row.value.tags.map(tag => (
              <Badge key={tag} bg="info" className="ms-1">
                {tag}
              </Badge>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}
