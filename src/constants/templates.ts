export const pseudoCodeTemplate = `<Layout>\n    <Header />\n    <Main />\n    <Footer />\n</Layout>`;

export const rootComponentTemplate = `import React from "react";
{{#imports}}
import {{childComponentName}} from "./{{componentDirName}}/{{childComponentName}}";
{{/imports}}

const {{name}}: React.FunctionComponent = () => {
    return ({{render}});
};

export default {{name}};
`;

export const childComponentTemplate = `import React from "react";

const {{name}}: React.FunctionComponent = () => {
    return (
        <div>...</div>
    )
};

export default {{name}};
`;
