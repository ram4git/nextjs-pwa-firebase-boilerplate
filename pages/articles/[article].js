import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { docWithId } from 'lib/firebase'
import { articleRef } from 'hooks/articles'

import Page from 'components/page/Page'
import ArticleDetails from 'components/articles/ArticleDetails'

function ArticleDetailsPage ({ article }) {
  // Note: 'query' contains both /:params and ?query=value from url
  const { query, asPath } = useRouter()
  return (
    <Page
      title={!article ? 'Loading...' : article.title}
      description={!article ? '' : article.content}
      path={asPath}
    >
      {!article ? (
        <div>Loading...</div>
      ) : (
        <ArticleDetails
          article={article}
        />
      )}

      <h2>Routing</h2>
      <p>Current query: <strong>{JSON.stringify(query)}</strong></p>

      <ul>
        <li><Link href='/'><a>Home</a></Link></li>
      </ul>
    </Page>
  )
}

export async function getServerSideProps ({ req, res, query }) {
  const articleId = query.article.split('-').pop()
  const articleSnapshot = await articleRef(articleId).get()
  if (!articleSnapshot.exists) {
    const notFoundError = new Error(`Not found: ${articleId}`)
    notFoundError.code = 'ENOENT'
    throw notFoundError
  }
  const article = docWithId(articleSnapshot)
  article.dateCreated = article.dateCreated.toString() // To avoid “cannot be serialized as JSON” error
  return { props: { article } }
}

export default ArticleDetailsPage
