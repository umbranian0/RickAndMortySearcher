import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, { useEffect, useState } from "react";
import Link from 'next/link'
import { motion } from 'framer-motion';

const defaultEndpoint = `https://rickandmortyapi.com/api/character/`;

export async function getServerSideProps() {
  const res = await fetch(defaultEndpoint)
  const data = await res.json();
  return {
    props: {
      data
    }
  }
}



export default function Home({data}) {

  const { info, results: defaultResults = [] } = data;
  const [results, updateResults] = useState(defaultResults);
  
  const [page, updatePage] = useState({
    ...info,
    current: defaultEndpoint
  });
//----------------  
  //load more images
  const { current } = page;

  useEffect(() => {
    if ( current === defaultEndpoint ) return;
  
    async function request() {
      const res = await fetch(current)
      const nextData = await res.json();
  
      updatePage({
        current,
        ...nextData.info
      });
  
      if ( !nextData.info?.prev ) {
        updateResults(nextData.results);
        return;
      }
  
      updateResults(prev => {
        return [
          ...prev,
          ...nextData.results
        ]
      });
    }
  
    request();
  }, [current]);
//----------------  

  function handleLoadMore() {
    updatePage(prev => {
      return {
        ...prev,
        current: page?.next
      }
    });
  }
 //----------------   
  //Search method
  function handleOnSubmitSearch(e) {
    e.preventDefault();
  
    const { currentTarget = {} } = e;
    const fields = Array.from(currentTarget?.elements);
    const fieldQuery = fields.find(field => field.name === 'query');
  
    const value = fieldQuery.value || '';
    const endpoint = `https://rickandmortyapi.com/api/character/?name=${value}`;
  
    updatePage({
      current: endpoint
    });
  }
//------------------  
  
  return (
 
    <div className={styles.container}>
      <Head>
        <title>Rick and Morty</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

      <motion.div initial="hidden" animate="visible" variants={{
        hidden: {
          scale: .8,
          opacity: 0
        },
        visible: {
          scale: 1,
          opacity: 1,
          transition: {
            delay: .4
          }
        },
      }}>

        <h1 className={styles.title}>
         Wubba Lubba Dub Dub!
        </h1>
      </motion.div>

        <p className={styles.description}>
        <h3>
         Rick and morty Character Wiki
        </h3>
          <form className={styles.search} onSubmit={handleOnSubmitSearch}>
          <input name="query" type="search" />
          <button>Search</button>
          </form>
        </p>

        <div className={styles.grid}>
          
          <ul className={styles.grid}>
          {results.map(result => {
            const { id, name, image } = result;

            return (
              <motion.li key={id} className={styles.card} whileHover={{
                position: 'relative',
                zIndex: 1,
                background: 'white',
                scale: [1, 1.4, 1.2],
                rotate: [0, 10, -10, 0],
                transition: {
                  duration: .2
                },
                filter: [
                  'hue-rotate(0) contrast(100%)',
                  'hue-rotate(360deg) contrast(200%)',
                  'hue-rotate(45deg) contrast(300%)',
                  'hue-rotate(0) contrast(100%)'
                ],
              }}>

                <Link href="/character/[id]" as={`/character/${id}`}>
                  <a>
                    <img src={image} alt={`${name} Thumbnail`} />
                    <h3>{ name }</h3>
                  </a>
                </Link>
              
              </motion.li>

            )
          })
          }
        </ul>

        </div>
        <p>
        <button onClick={handleLoadMore}>Load More</button>
        </p>

      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}
