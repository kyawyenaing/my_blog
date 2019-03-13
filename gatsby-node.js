const path = require('path');
const {createFilePath,createFileNode} = require('gatsby-source-filesystem');
exports.createPages = ({ actions, graphql }) => {
    const { createPage } = actions

    const blogPostTemplate = path.resolve(`src/templates/blog-post.js`)

    return new Promise((resolve, reject) => {

        resolve(graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
              fields{
                  route
              }
            frontmatter {
              title
            }
          }
        }
      }
    }
  `).then(result => {
                if (result.errors) {
                    console.log(result.errors)
                    return reject(result.errors)
                }

                const blogTemplate = path.resolve('./src/templates/blog-post.js');

                result.data.allMarkdownRemark.edges.forEach(({ node }) => {
                    createPage({
                        path: node.fields.route,
                        component: blogTemplate,
                        context: {
                            route: node.fields.route,
                        }, // additional data can be passed via context
                    })
                })
                return
            })
        )
    })
}


// here is adding new node
exports.onCreateNode = ({node,getNode,actions}) => {
	const {createNodeField} = actions;
	if(node.internal.type === 'MarkdownRemark') {
		const route = createFilePath({node,getNode,basePath:'pages'});
		createNodeField({
			node,
			name:'route',
			value:route,
		});
	}
}