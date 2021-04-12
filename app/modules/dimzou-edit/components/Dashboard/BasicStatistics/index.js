import React from 'react';
import styles from './index.module.scss';

function BasicStatistics() {
  return (
    <div className={styles.block}>
      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.card__title}>总阅读量</div>
          <div className={styles.card__desc}>
            <span className={styles.card__num}>37501</span>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.card__title}>今日阅读量</div>
          <div className={styles.card__desc}>
            <span className={styles.card__num}>587</span>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.card__title}>收到的编辑邀请</div>
          <div className={styles.card__desc}>
            <span className={styles.card__num}>1</span>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.card__title}>收到的评论</div>
          <div className={styles.card__desc}>
            <span className={styles.card__num}>--</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BasicStatistics;
