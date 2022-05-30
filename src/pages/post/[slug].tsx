/* eslint-disable prettier/prettier */
import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from '../../styles/pages/post.module.scss';

interface Post {
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

export default function Post(): JSX.Element {
  return (
    <div className={styles.container}>
      <img src="/Banner.png" alt="banner" />

      <div className={styles.content}>
        <div className={styles.title}>
          <h1>Criando um app CRA do zero</h1>

          <div className={styles.postInfo}>
            <time>
              <img src="/images/calendar.svg" alt="calendar" />
              15 Mar 2021
            </time>
            <p>
              <img src="/images/user.svg" alt="user" />
              Joseph Oliveira
            </p>

            <time>
              <img src="/images/clock.svg" alt="clock" />
              4m
            </time>
          </div>
        </div>

        <div className={styles.post}>
          <h1>Proin et varius</h1>

          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum dicta
            dolor quos, necessitatibus facere, ea quis voluptatem porro delectus
            minus beatae odit earum natus similique sunt quae deserunt
            cupiditate libero. Lorem ipsum dolor sit amet consectetur,
            adipisicing elit. Ad blanditiis fugit et molestias, quas temporibus
            voluptatibus nisi. Soluta nihil, enim suscipit veritatis ratione
            expedita sapiente totam beatae. Provident, laborum facilis. Lorem
            ipsum, dolor sit amet consectetur adipisicing elit. Perferendis
            dolor sunt enim rem quam libero aut dolore dolorum vero esse,
            commodi repellendus nesciunt doloribus a hic mollitia eveniet
          </p>
        </div>
      </div>
    </div>
  );
}

// export const getStaticPaths = async () => {
//   const prismic = getPrismicClient({});
//   const posts = await prismic.getByType(TODO);

//   // TODO
// };

// export const getStaticProps = async ({params }) => {
//   const prismic = getPrismicClient({});
//   const response = await prismic.getByUID(TODO);

//   // TODO
// };
