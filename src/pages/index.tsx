/* eslint-disable prettier/prettier */
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
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

export default function Home(props: HomeProps): JSX.Element {
  const { postsPagination } = props;
  return (
    <>
      <Head>
        <title>Início</title>
      </Head>
      <div className={styles.container}>
        {postsPagination.results.map(post => {
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
                    {first_publication_date}
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

        <button type="button">Carregar mais posts</button>
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
    first_publication_date: format(
      new Date(post.first_publication_date),
      'd MMM yyyy',
      {
        locale: ptBR,
      }
    ),
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
  };
};
