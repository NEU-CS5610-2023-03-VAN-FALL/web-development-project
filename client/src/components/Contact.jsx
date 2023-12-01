import React from 'react';
import "../style/contact.css";

export default function Contact() {
  return (
    <form>
      <div>
      <img src="https://i.fbcd.co/products/original/pig-logo-design-vector-0e7cea69facb05b519d578326eca960e19f6ae46513ef4226529aa50362635dd.jpg" alt="Logo" className="logo" />
        <p>
          <h1>Contact Us</h1>
        </p>
        <label htmlFor="firstName">First Name:</label>
        <input type="text" id="firstName" />
      </div>
      <br />

      <div>
        <label htmlFor="lastName">Last Name: </label>
        <input type="text" id="lastName" />
      </div>
      <br />

      <div>
        <label htmlFor="email">Email Address:</label>
        <input type="text" id="email" />
      </div>
      <br />

      <div>
        <label htmlFor="phone">Phone Number:</label>
        <input type="text" id="phone" />
      </div>
      <br />

      <div>
        <p>
          <strong>Date of Birth</strong>
        </p>
        <input type="date" id="time" name="time" />
      </div>
      <br />

      <div>
        <p>
          <strong>Please write your special requirement below</strong>
        </p>
        <label htmlFor="message">Special Requirement:</label>
        <textarea id="message" name="message"></textarea>
      </div>
      <br />

      <div>
        <p>
          <strong>How do you know us</strong>
        </p>
        <input type="radio" id="Website" name="howYouKnow" />
        <label htmlFor="Website">Website</label>
        <br />
        <input type="radio" id="Friend" name="howYouKnow" />
        <label htmlFor="Friend">Friend</label>
        <br />
        <input type="radio" id="News" name="howYouKnow" />
        <label htmlFor="News">News</label>
      </div>
      <br />
      <br />

      <div>
        <input type="submit" value="Submit" />
      </div>
      <br />
    </form>
  );
}
