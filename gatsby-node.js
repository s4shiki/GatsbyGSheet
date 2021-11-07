const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  // Define a template for blog post
  const blogPost = path.resolve(`./src/templates/blog-post.js`)

  const result = await graphql(
    `
      {
        allGSheetBlog(
          sort: { fields: [createdAt], order: DESC }
         ) {
          edges {
            node {
              id
              slug
            }
            previous {
              id
            }
            next {
              id
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }

  const edges = result.data.allGSheetBlog.edges

  // Create blog posts pages
  if (edges.length > 0) {
    edges.forEach((edge, index) => {
      const node = edge.node
      const previousPostId = edge.previous?.id || null
      const nextPostId = edge.next?.id || null

      createPage({
        path: node.slug,
        component: blogPost,
        context: {
          id: node.id,
          previousPostId,
          nextPostId,
        },
      })
    })
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }
  `)
}
