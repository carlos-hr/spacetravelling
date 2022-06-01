/* eslint-disable prettier/prettier */
/* eslint-disable react/no-danger */
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';
import styles from '../../styles/pages/post.module.scss';

interface Post {
  uid: string;
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  const readingTime = Math.ceil(
    post.data.content.reduce((counter, content) => {
      const bodyWords = RichText.asText(content.body).split(' ').length;
      const headingWords = content.heading.split(' ').length;
      const words = bodyWords + headingWords;
      return counter + words;
    }, 0) / 200
  );

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <Head>
        <title>Post | {post?.data.title}</title>
      </Head>
      <div className={styles.container}>
        {post && (
          <>
            <img src={post.data.banner.url} alt="banner" />

            <div className={styles.content}>
              <div className={styles.title}>
                <h1>{post.data.title}</h1>

                <div className={styles.postInfo}>
                  <time>
                    <img src="/images/calendar.svg" alt="calendar" />
                    {format(
                      new Date(post.first_publication_date),
                      'd MMM yyyy',
                      {
                        locale: ptBR,
                      }
                    )}
                  </time>
                  <p>
                    <img src="/images/user.svg" alt="user" />
                    {post.data.author}
                  </p>

                  <time>
                    <img src="/images/clock.svg" alt="clock" />
                    {`${readingTime} min`}
                  </time>
                </div>
              </div>

              {post.data.content.map(content => {
                return (
                  <div className={styles.post} key={content.heading}>
                    <h1>{content.heading}</h1>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: RichText.asHtml(content.body),
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('post');

  const paths = posts.results.reduce((prevList, nextPost) => {
    return prevList.concat({ params: { slug: nextPost.uid } });
  }, []);

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('post', String(slug));

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      author: response.data.author,
      banner: {
        url: response.data.banner.url,
      },
      content: response.data.content,
    },
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 60, // 1hour
  };
};
