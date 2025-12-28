import TabPane from "../../../../components/tabpane/tabpane";
import TabPaneContent from "../../../../components/tabpane/tabPaneContent";
import CourseBulderProvider from "../../../../context/courseContext";
import ResourceChoser from "../organizer/resourceChoser";
import ResourceList from "../organizer/resourceList";
import BuilderToolbar from "./builderToolbar";
import ContentChoser from "./contentChoser/contentChoser";
import CourseContent from "./CourseContent";
import CourseDescription from "./courseDescription";
import Preview from "./preview";

export default function CourseBuilder({ data }) {
  return (
    <main className="flex flex-col flex-1">
      <CourseBulderProvider lecon={data}>
        <ResourceChoser>
          <TabPane defaultValue="builder">
            <BuilderToolbar />
            <TabPaneContent value="builder">
              <div
                className="relative flex-1 flex gap-2 bg-gray-200 overflow-hidden"
                id="course-builder"
              >
                <CourseContent />
                <ContentChoser />
                <ResourceList />
                <CourseDescription />
              </div>
            </TabPaneContent>
            <TabPaneContent value="preview">
              <Preview />
            </TabPaneContent>
          </TabPane>
        </ResourceChoser>
      </CourseBulderProvider>
    </main>
  );
}
