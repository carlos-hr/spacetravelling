/* eslint-disable prettier/prettier */
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { getPrismicClient } from '../services/prismic';
import styles from '../styles/pages/home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const { results, next_page } = postsPagination;

  const [posts, setPosts] = useState(results);
  const [nextPage, setNextPage] = useState(next_page);

  const fetchNextPage = (): void => {
    fetch(nextPage)
      .then(res => res.json())
      .then(data => {
        setNextPage(data.next_page);
        data.results.map((post: Post) =>
          setPosts([
            ...posts,
            {
              uid: post.uid,
              first_publication_date: post.first_publication_date,
              data: {
                title: post.data.title,
                subtitle: post.data.subtitle,
                author: post.data.author,
              },
            },
          ])
        );
      });
  };

  return (
    <>
      <Head>
        <title>Início</title>
      </Head>
      <div className={styles.container}>
        {posts.map(post => {
          const { uid, first_publication_date } = post;
          const { title, subtitle, author } = post.data;

          return (
            <Link key={uid} href={`/post/${uid}`}>
              <div className={styles.post}>
                <h1>{title}</h1>
                <p>{subtitle}</p>
                <div className={styles.postInfo}>
                  <time>
                    <img src="/images/calendar.svg" alt="calendar" />
                    {format(new Date(first_publication_date), 'd MMM yyyy', {
                      locale: ptBR,
                    })}
                  </time>
                  <p>
                    <img src="/images/user.svg" alt="user" />
                    {author}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}

        {nextPage && (
          <button type="button" onClick={fetchNextPage}>
            Carregar mais posts
          </button>
        )}
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('post', {
    pageSize: 1,
  });

  const posts = postsResponse.results.map(post => ({
    uid: post.uid,
    first_publication_date: post.first_publication_date,
    data: {
      title: post.data.title,
      subtitle: post.data.subtitle,
      author: post.data.author,
    },
  }));

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: posts,
  };

  return {
    props: { postsPagination },
    revalidate: 60 * 60, // 1hour
  };
};
