import React from 'react';
import ErrorPageWrapper from './errorPageWrapper';
import ErrorPageDescription from './errorPageDescription';
import ErrorPageTitle from './errorPageTitle';
import ErrorImg from 'static/error.svg';
import ErrorPageUrl from './errorPageUrl';
import BackButton from 'UI/BackButton';

const ErrorPage = ({
  title,
  description,
  url,
  hasBackButton,
  href,
}) => {
  let descriptionToRender = (
    <ErrorPageDescription>
      <span>{description}</span>
    </ErrorPageDescription>
  );

  descriptionToRender = url ? (
    <ErrorPageUrl
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {descriptionToRender}
    </ErrorPageUrl>
  ) : descriptionToRender;

  return (
    <ErrorPageWrapper>
      {hasBackButton && <BackButton href={href}/>}
      <ErrorImg />
      <ErrorPageTitle>
        {title}
      </ErrorPageTitle>
      {descriptionToRender}
    </ErrorPageWrapper>
  )
}

export default ErrorPage;
