import EmptyState from "../../../../components/empty/empty";
import VersionItem from "./versionItem";

export default function Versions({ data: { versions = [], versionActiveId } }) {
  return (
    <>
      {versions.length > 0 ? (
        <ul className="flex gap-2">
          {versions.map((version) => (
            <VersionItem
              version={version}
              key={version.id}
              isActive={version.id === versionActiveId}
            />
          ))}
        </ul>
      ) : (
        <div className="w-full flex justify-center items-center">
          <EmptyState />
        </div>
      )}
    </>
  );
}
