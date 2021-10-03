import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import * as VanillaDex from "../assets/VanillaDex.json";

const pokemonNames = VanillaDex.idToName;

const SuggestionsListComponent = ({
  filteredSuggestions,
  onClick,
  activeSuggestionIndex,
}) => {
  const selectedElement = useRef(null);
  useEffect(() => {
    selectedElement?.current?.scrollIntoView();
  });

  return filteredSuggestions.length ? (
    <ul className="suggestions">
      {filteredSuggestions.map((suggestion, index) => {
        let className;
        // Flag the active suggestion with a class
        if (index === activeSuggestionIndex) {
          className = "suggestion-active";
        }
        return (
          <li
            className={className}
            key={suggestion}
            onClick={onClick}
            ref={index === activeSuggestionIndex ? selectedElement : null}
          >
            {suggestion}
          </li>
        );
      })}
    </ul>
  ) : (
    <div className="no-suggestions">
      <em>No suggestions</em>
    </div>
  );
};

const InputBox = ({ onTermChange, onTermSubmit, fusionPart }) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedElementDOM, setSelectedElementRef] = useState(null);

  let [input, setInput] = useState("");

  const triggerSubmit = () => {
    console.log("attempting submit dispatch");

    formRef?.current?.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true })
    );
  };
  const formRef = useRef(null);

  useEffect(() => {
    document.addEventListener("mousedown", clickOut);
  }, []);

  const clickOut = (e) => {
    const { current: wrap } = formRef;
    if (formRef && !wrap?.contains(e.target)) {
      setShowSuggestions(false);
    }
  };

  const setLocalInput = setInput;
  setInput = (i) => {
    i = i ?? input ?? "";
    setLocalInput(i);
    onTermChange(i);
  };

  const suggestions = pokemonNames;

  const onChange = (e) => {
    const userInput = e.target.value;
    const nameFilter = (suggestion) => {
      return suggestion.toLowerCase().indexOf(userInput.toLowerCase()) == 0;
    };

    // Filter our suggestions that don't contain the user's input
    const unLinked = suggestions.filter(nameFilter);

    setInput(e.target.value);
    setFilteredSuggestions(unLinked);
    setActiveSuggestionIndex(0);
    setShowSuggestions(true);
  };

  const onSubmit = (e) => {
    try {
      if (input && input.length > 0) {
        onTermSubmit(input);
        e.preventDefault();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onClick = (e) => {
    setFilteredSuggestions([]);
    setInput(e.target.innerText);
    setActiveSuggestionIndex(0);
    setShowSuggestions(false);
    triggerSubmit();
  };

  const onKeyDown = (e) => {
    console.log(activeSuggestionIndex);
    switch (e.key) {
      case "Enter": {
        if (showSuggestions) {
          setInput(
            `${filteredSuggestions[activeSuggestionIndex]
              .charAt(0)
              .toUpperCase()}${filteredSuggestions[activeSuggestionIndex].slice(
              1
            )}`
          );
          setActiveSuggestionIndex(0);
          setShowSuggestions(false);
          triggerSubmit();
        }
        break;
      }
      case "ArrowUp": {
        if (activeSuggestionIndex > 0 && showSuggestions) {
          setActiveSuggestionIndex(activeSuggestionIndex - 1);
        } else {
          setShowSuggestions(false);
        }
        e.preventDefault();

        break;
      }
      case "ArrowDown": {
        if (filteredSuggestions.length) {
          if (showSuggestions) {
            setActiveSuggestionIndex(
              (prev) => (prev + 1) % filteredSuggestions.length // TODO: UNTESTED - TEST THIS
            );
          } else setShowSuggestions(true);
        }
        e.preventDefault();
        break;
      }
      case "Escape": {
        setShowSuggestions(false);
        break;
      }
      default:
        break;
    }
  };

  return (
    <div className="DexInputContainer">
      {fusionPart}
      <form onSubmit={onSubmit} className="DexInput" ref={formRef}>
        <input
          className="RetroBorder"
          type="text"
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={input}
          placeholder="Pokedex#/Name"
          maxLength={20}
        />
        {showSuggestions && input && (
          <SuggestionsListComponent
            filteredSuggestions={filteredSuggestions}
            onClick={onClick}
            activeSuggestionIndex={activeSuggestionIndex}
            // onBlur={onBlur}
            // onFocus={onFocus}
            selectedElementDOM={selectedElementDOM}
          />
        )}
        {/* <input type="submit" value="Submit" /> */}
      </form>
    </div>
  );
};

export default InputBox;
