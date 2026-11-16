import type { CloudFile } from "../../types/file.types";
import { formatBytes } from "../../utils/formatBytes";

type RecentFileRowProps = {
  file: CloudFile;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function RecentFileRow({ file }: RecentFileRowProps) {
  return (
    <tr className="border-t border-gray-100">
      <th scope="row" className="px-6 py-4 text-left font-medium text-gray-900">
        {file.name}
      </th>
      <td className="whitespace-nowrap px-6 py-4 text-gray-600">
        {formatBytes(file.size)}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-gray-600">
        <time dateTime={file.updatedAt}>
          {dateFormatter.format(new Date(file.updatedAt))}
        </time>
      </td>
    </tr>
  );
}

export default RecentFileRow;
